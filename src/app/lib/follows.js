import { supabase } from './supabase'

export async function getFollowedCreatorIds(userId) {
  if (!userId) return []
  const { data, error } = await supabase.from('follows').select('creator_id').eq('user_id', userId)
  if (error) return []
  return data.map(r => r.creator_id)
}

export async function isFollowing(userId, creatorId) {
  if (!userId) return false
  const { data } = await supabase.from('follows').select('id').eq('user_id', userId).eq('creator_id', creatorId).maybeSingle()
  return !!data
}

// Returns the new follow-state (true if now following, false if unfollowed)
export async function toggleFollow(userId, creatorId) {
  const { data: existing } = await supabase.from('follows').select('id').eq('user_id', userId).eq('creator_id', creatorId).maybeSingle()
  if (existing) {
    await supabase.from('follows').delete().eq('id', existing.id)
    return false
  }
  await supabase.from('follows').insert([{ user_id: userId, creator_id: creatorId }])
  return true
}

export async function getFollowerCount(creatorId) {
  const { count } = await supabase.from('follows').select('id', { count: 'exact', head: true }).eq('creator_id', creatorId)
  return count || 0
}
