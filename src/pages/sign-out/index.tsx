import { clearAccessToken } from "@/setup/slices/auth-slice";
import { clearLocalcart } from "@/setup/slices/localCart-slice";
import { clearCredentials } from "@/setup/slices/user-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(clearCredentials());
    dispatch(clearLocalcart());
    dispatch(clearAccessToken());
    navigate("/");
  }, []);

  return null;
};

export default SignOut;
