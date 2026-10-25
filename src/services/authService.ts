import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserSession } from '../context/AuthContext';

/**
 * Normalizes user input (email or phone number) into a valid authentication identifier.
 * If a 10-digit Indian phone number is supplied, converts it to an internal alias
 * e.g., 9876543210 -> 9876543210@phone.anystop.app, enabling seamless login without SMS gateway cost.
 */
export const normalizeIdentifier = (raw: string): { email: string; isPhone: boolean; phoneDisplay: string } => {
  const trimmed = raw.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (/^[6-9]\d{9}$/.test(digitsOnly)) {
    return {
      email: `${digitsOnly}@phone.anystop.app`,
      isPhone: true,
      phoneDisplay: digitsOnly,
    };
  }

  return {
    email: trimmed.toLowerCase(),
    isPhone: false,
    phoneDisplay: '',
  };
};

export interface AuthResult {
  success: boolean;
  user?: UserSession;
  error?: string;
}

/**
 * Signs up a new passenger via Supabase Auth & creates their PostgreSQL profile.
 */
export async function signUpWithSupabase(
  name: string,
  identifier: string,
  password: string,
  ticketNo?: string,
  phoneParam?: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    };
  }

  const { email, phoneDisplay } = normalizeIdentifier(identifier);
  const finalPhone = phoneParam ? phoneParam.replace(/\D/g, '') : phoneDisplay;
  const assignedTicket = ticketNo || `NO. ${Math.floor(Math.random() * 8999 + 1000)}`;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: finalPhone || null,
          ticketNo: assignedTicket,
          homeStop: 'Chandigarh ISBT-43',
          preferredClass: 'All Types',
        },
      },
    });

    if (error) {
      return { success: false, error: formatSupabaseError(error.message) };
    }

    if (!data.user) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }

    // Try creating profile record if trigger didn't fire
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        email: data.user.email,
        phone: finalPhone || null,
        ticket_no: assignedTicket,
        home_stop: 'Chandigarh ISBT-43',
        preferred_class: 'All Types',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });
    } catch (upsertErr) {
      console.warn('Profile table upsert fallback warning:', upsertErr);
    }

    const sessionUser: UserSession = {
      id: data.user.id,
      name,
      phoneOrEmail: identifier,
      ticketNo: assignedTicket,
      boardedAt: Date.now(),
      homeStop: 'Chandigarh ISBT-43',
      preferredClass: 'All Types',
      totalSearches: 0,
      avatarUrl: undefined,
    };

    return { success: true, user: sessionUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during signup';
    return { success: false, error: formatSupabaseError(message) };
  }
}

/**
 * Signs in an existing passenger via Supabase Auth & retrieves their PostgreSQL profile.
 */
export async function signInWithSupabase(
  identifier: string,
  password: string
): Promise<AuthResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    };
  }

  const { email } = normalizeIdentifier(identifier);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: formatSupabaseError(error.message) };
    }

    if (!data.user) {
      return { success: false, error: 'Invalid user credentials.' };
    }

    // Fetch rich profile from Postgres profiles table
    let profileData: Partial<UserSession> = {};
    try {
      const { data: dbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (dbProfile) {
        profileData = {
          name: dbProfile.name || undefined,
          ticketNo: dbProfile.ticket_no || undefined,
          homeStop: dbProfile.home_stop || undefined,
          preferredClass: dbProfile.preferred_class || undefined,
          totalSearches: dbProfile.total_searches ?? 0,
          avatarUrl: dbProfile.avatar_url || undefined,
        };
      }
    } catch (profileErr) {
      console.warn('Could not fetch profiles row, falling back to auth metadata:', profileErr);
    }

    const meta = data.user.user_metadata || {};
    const displayName =
      profileData.name ||
      meta.name ||
      (identifier.includes('@') ? identifier.split('@')[0] : 'Passenger');

    const sessionUser: UserSession = {
      id: data.user.id,
      name: displayName,
      phoneOrEmail: identifier,
      ticketNo: profileData.ticketNo || meta.ticketNo || `NO. ${Math.floor(Math.random() * 8999 + 1000)}`,
      boardedAt: Date.now(),
      homeStop: profileData.homeStop || meta.homeStop || 'Chandigarh ISBT-43',
      preferredClass: profileData.preferredClass || meta.preferredClass || 'All Types',
      totalSearches: profileData.totalSearches ?? 0,
      avatarUrl: profileData.avatarUrl || meta.avatarUrl || undefined,
    };

    return { success: true, user: sessionUser };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during login';
    return { success: false, error: formatSupabaseError(message) };
  }
}

/**
 * Signs out from Supabase Auth session.
 */
export async function signOutFromSupabase(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out of Supabase:', err);
    }
  }
}

/**
 * Persists profile changes to PostgreSQL profiles table and Supabase auth metadata.
 */
export async function updateSupabaseProfile(
  userId: string,
  updates: Partial<UserSession>
): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    // 1. Update database table via upsert so it never fails even if record was missing
    const dbPayload: Record<string, unknown> = {
      id: userId,
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.homeStop !== undefined) dbPayload.home_stop = updates.homeStop;
    if (updates.preferredClass !== undefined) dbPayload.preferred_class = updates.preferredClass;
    if (updates.avatarUrl !== undefined) dbPayload.avatar_url = updates.avatarUrl || null;
    if (updates.totalSearches !== undefined) dbPayload.total_searches = updates.totalSearches;

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert(dbPayload, { onConflict: 'id' });

    if (dbError) {
      console.warn('Profile upsert note:', dbError);
    }

    // 2. Update auth user metadata
    await supabase.auth.updateUser({
      data: updates,
    });

    return true;
  } catch (err) {
    console.error('Failed to sync profile update to Supabase:', err);
    return false;
  }
}

/**
 * Saves and updates a user's profile avatar in Supabase.
 * Attempts Supabase Storage upload first; if storage bucket is not configured,
 * seamlessly falls back to storing the compressed image data directly in PostgreSQL profiles.avatar_url.
 */
export async function saveProfileAvatar(
  userId: string,
  dataUrlOrBlob: string | Blob
): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: true, avatarUrl: typeof dataUrlOrBlob === 'string' ? dataUrlOrBlob : undefined };
  }

  let finalUrl: string | null = null;

  try {
    // 1. Try uploading to Supabase Storage 'avatars' bucket
    if (typeof dataUrlOrBlob === 'string' && dataUrlOrBlob.startsWith('data:')) {
      const res = await fetch(dataUrlOrBlob);
      const blob = await res.blob();
      const fileExt = blob.type.split('/')[1] || 'jpg';
      const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, {
          upsert: true,
          contentType: blob.type || 'image/jpeg',
          cacheControl: '3600',
        });

      if (!uploadError && uploadData) {
        const { data: pubData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        if (pubData?.publicUrl) {
          finalUrl = pubData.publicUrl;
        }
      }
    }
  } catch (storageErr) {
    console.warn('Supabase storage upload note, falling back to database text column:', storageErr);
  }

  // 2. If storage upload did not yield a URL, store the dataUrl directly in Postgres column
  if (!finalUrl && typeof dataUrlOrBlob === 'string') {
    finalUrl = dataUrlOrBlob;
  }

  // 3. Persist avatar_url in public.profiles table with upsert
  try {
    const { error: dbError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        avatar_url: finalUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (dbError) {
      console.warn('Error updating profiles avatar_url in DB:', dbError);
    }

    // 4. Also update Supabase auth metadata
    await supabase.auth.updateUser({
      data: { avatarUrl: finalUrl },
    });

    return { success: true, avatarUrl: finalUrl || undefined };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save avatar to database';
    return { success: false, error: message };
  }
}

/**
 * Removes the profile avatar from Supabase PostgreSQL and auth metadata.
 */
export async function removeProfileAvatar(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return true;

  try {
    await supabase.from('profiles').upsert({
      id: userId,
      avatar_url: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    await supabase.auth.updateUser({
      data: { avatarUrl: null },
    });

    return true;
  } catch (err) {
    console.error('Failed to remove avatar from database:', err);
    return false;
  }
}

/**
 * Initiates Google OAuth sign in via Supabase.
 */
export async function signInWithGoogleOAuth(): Promise<{ error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/buses`,
      },
    });

    if (error) {
      return { error: formatSupabaseError(error.message) };
    }

    return {};
  } catch (err: any) {
    return { error: err?.message || 'Google sign in failed' };
  }
}

/**
 * Translates raw Supabase API errors into clear, commuter-friendly messages.
 */
function formatSupabaseError(rawMessage: string): string {
  const msg = rawMessage.toLowerCase();
  if (msg.includes('user already registered') || msg.includes('already exists')) {
    return 'This email or mobile number is already registered. Please log in instead.';
  }
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'Incorrect email/mobile or password. Please check and try again.';
  }
  if (msg.includes('password should be at least')) {
    return 'Password is too short. Please choose a password with at least 6 characters.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email address or disable email confirmation in your Supabase dashboard.';
  }
  if (msg.includes('rate limit')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  return rawMessage;
}
