import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xisjhlkpiqzkjqlayjhs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpc2pobGtwaXF6a2pxbGF5amhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDg1OTAsImV4cCI6MjA3MTcyNDU5MH0.b0BzOor5uVOA8tTlaa8_xirmP_yuXxuw3OxEaQjwCMY'; // From Supabase dashboard
const supabase = createClient(supabaseUrl, supabaseKey);

// Submit a score
export async function submitScore(name, score) {
  const { error } = await supabase
    .from('highscores')
    .insert([{ name, score }]);
  if (error) console.error('Error submitting score:', error);
}

// Fetch top 10 scores
export async function getTopScores() {
  const { data, error } = await supabase
    .from('highscores')
    .select('name, score')
    .order('score', { ascending: false })
    .limit(10);
  if (error) console.error('Error fetching scores:', error);
  return data || [];
}
