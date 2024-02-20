export const useToken = () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    const token_exist = access_token && refresh_token;
    return { access_token, refresh_token, token_exist }
}


export const useUserInfo = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {userInfo}
}