import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Post = {
  id: number
  content: string
  created_at: string
}

export type CourseReview = {
  id: number
  course_id: number
  course_name: string
  rating: number  // 1-5
  content: string
  nickname: string
  created_at: string
}
