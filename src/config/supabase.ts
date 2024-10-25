import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.APP_SUPABASE_URL || ""
const supabaseKey = process.env.APP_SUPABASE_KEY || ""
export const supabase = createClient(supabaseUrl, supabaseKey)