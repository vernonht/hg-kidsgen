import Cookies from 'js-cookie';

export default function ({ store, redirect }) {
    // If the user is not authenticated
    if (!Cookies.get('token')) {
        alert('Unauthorized');
        return redirect('/')
    }
}
