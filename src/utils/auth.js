const TokenKey = 'iam-Token';

export const getIamToken = () => localStorage.getItem(TokenKey);

const UserInfoKey = 'user-info';

export function getUserInfo() {
  const val = localStorage.getItem(UserInfoKey);
  return val ? JSON.parse(val) : '';
}

export default getIamToken;
