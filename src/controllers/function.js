module.exports = {
  register_user: {
    controller: "user_auth",
    function: "registerUser",
  },
  user_verification: {
    controller: "user_auth",
    function: "userVerification",
  },
  login_user: {
    controller: "user_auth",
    function: "loginUser",
  },
  logout_user: {
    controller: "user_auth",
    function: "logoutUser",
  },
  refresh_token: {
    controller: "token",
    function: "refreshToken",
  },
  verify_username: {
    controller: "user_auth",
    function: "userNameVerification",
  },
  user_id_check: {
    controller: "user_auth",
    function: "userIdCheck",
  },
  request_for_change_password: {
    controller: "user_auth",
    function: "requestForChangePassword",
  },
  social_login: {
    controller: "user_auth",
    function: "socialLogin",
  },
  change_userid: {
    controller: "user_auth",
    function: "changeUserid",
  },
  change_password: {
    controller: "user_auth",
    function: "changePassword",
  },
  verify_user_list: {
    controller: "user_auth",
    function: "verifyUserList",
  },
  requested_for_user_verification: {
    controller: "user_auth",
    function: "requestedForUserVerification",
  },
  action_user_verification: {
    controller: "user_auth",
    function: "actionUserVerification",
  },
  user_details: {
    controller: "dashboard_auth",
    function: "userDetails",
  },
  fetch_avatar: {
    controller: "dashboard_auth",
    function: "fetchAvatar",
  },
  all_user: {
    controller: "dashboard_auth",
    function: "allUser",
  },
  details_update: {
    controller: "dashboard_auth",
    function: "detailsUpdate",
  },
  avatar_add: {
    controller: "dashboard_auth",
    function: "avatarAdd",
  },
  avatar_edit: {
    controller: "dashboard_auth",
    function: "avatarEdit",
  },
};
