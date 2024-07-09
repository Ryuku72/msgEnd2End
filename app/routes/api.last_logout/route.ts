/* eslint-disable no-console */
import { ActionFunctionArgs, json } from '@remix-run/node';
import { initServer } from '~/services/API';

export async function action({ request }: ActionFunctionArgs) {
  const { supabaseClient, headers } = await initServer(request);

  try {
    const userDetails = await supabaseClient.auth.getUser();
    if (!userDetails.data.user?.id) return null;

    const data = await request.formData();
    const last_logout = data.get('last_logout') as string;

    // Function to check if logout is within 5 seconds of last sign-in
    const isWithinFiveSeconds = (logout: string, userAt: string): boolean => {
      const logoutDate: number = new Date(logout).getTime();
      const userAtDate: number = new Date(userAt).getTime();

      const differenceInMilliseconds: number = Math.abs(logoutDate - userAtDate);
      const fiveSecondsInMilliseconds: number = 5 * 1000;

      return differenceInMilliseconds <= fiveSecondsInMilliseconds;
    };

    // Check if logout is within 5 seconds, if not, return null
    if (isWithinFiveSeconds(last_logout, userDetails.data.user.last_sign_in_at as string)) return null;
    // Update user's last_logout date
    const response = await supabaseClient.auth.updateUser({ data: { last_logout: userDetails.data.user.last_sign_in_at } });

    if (response.error) {
      console.error('Error updating user');
      console.error(response.error);
      return json({ error: { message: response.error.message } }, { headers });
    }

    // Return successful response
    return json(null, { headers });
  } catch (error) {
    console.error('Server error:', error);
    return json({ error: { message: 'Server error occurred' } }, { headers });
  }
}