import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ubvyegfijthwscdmsugr.supabase.co'
const supabaseKey = process.env.APP_SUPABASE_KEY || ""
export const supabase = createClient(supabaseUrl, supabaseKey)