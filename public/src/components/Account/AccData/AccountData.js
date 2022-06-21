import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../../../config/config";
import { useAuthContext } from "../../../services/authContext/authContext";

//components
import Input from "../../Form/Input";
import SubmitButton from "../../Form/SubmitButton";

//styles
import "../../../styles/account/details/acc_data_form.css";

import no_avatar from "../../../assets/images/no_avatar.png";
import { handleUpload } from "../../../services/upload/upload";

const AccountData = ({
    initUserData,
    userData,
    error,
    setError,
    editing,
    setUserData,
    updateInfoMsg,
    setUpdateInfoMsg,
    fileImg,
    setFileImg
}) => {
    const navigate = useNavigate();
    const {user,getUser} = useAuthContext();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        //clear errors
        setError(initUserData);

        const options = {
            headers: { "Content-Type": "application/json" },
        };
        try {

            const res = await axios.post(`${config.api.auth}`, userData, options);
            if (res.status === 201) {
                return navigate("/login");
            }
        } catch (error) {
            if (error.response.status === 500) {
                return setError({ ...error, server: "Server error, Try again later" });
            }
            setError(error.response.data);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        let imgUrl = '';
        const updateData = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            birthday: userData.birthday,
            password: userData.password,
            repeat_password: userData.repeat_password,
        }
        //clear errors
        setError(initUserData);
        //check for image
        if (fileImg) {
            imgUrl = await handleUpload(fileImg);
            updateData.image = imgUrl
        }

        const options = {
            headers: { "Content-Type": "application/json" },
        };

        try {
            const res = await axios.patch(
                `${config.api.auth}/update`,
                updateData,
                options
            );
            if (res.status === 204) {
                // setUserData({ ...userData, password: "", repeat_password: "" });
                // delete userData.image;
                setUpdateInfoMsg("Update success !");
                getUser();
                setFileImg('');
                setTimeout(() => {
                    setUpdateInfoMsg('');
                }, 2000);
            };
        } catch (error) {
            if (error.response.status === 500) {
                return setError({ ...error, server: "Server error, Try again later" });
            }
            setError(error.response.data);
        }
    };

  

    return (
        <form
            className="acc-data-form"
            onSubmit={editing ? handleUpdate : handleSubmit}
        >
            {editing && (
                <div className="avatar-wrapper">
                    <img src={fileImg ? URL.createObjectURL(fileImg) : user.image ? user.image : no_avatar} />


                    <label htmlFor="avatar">change avatar</label>
                    <input id="avatar" type="file" onChange={(e) => { setFileImg(e.target.files[0]) }} />
                </div>
            )}

            <div className="acc-data-form-left">
                <Input
                    label="first name"
                    input_type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="first name"
                    data={userData}
                    error={error}
                    setData={setUserData}
                    className="register"
                />
                <Input
                    label="email"
                    input_type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    data={userData}
                    error={error}
                    setData={setUserData}
                    className="register"
                />
                <Input
                    label="password"
                    input_type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    data={userData}
                    error={error}
                    setData={setUserData}
                    className="register"
                />
                <SubmitButton button_text={editing ? "save" : "create account"} />
                <p className="error-msg">{error.server && error.server}</p>
                <p className="update-info-msg">{updateInfoMsg}</p>
            </div>
            <div className="acc-data-form-right">
                <Input
                    label="last name"
                    input_type="text"
                    id="last_name"
                    name="last_name"
                    placeholder="last_name"
                    data={userData}
                    error={error}
                    setData={setUserData}
                    className="register"
                />
                <Input
                    label="birthday"
                    input_type="date"
                    id="date"
                    name="birthday"
                    placeholder="birthday"
                    data={userData}
                    error={error}
                    setData={setUserData}
                    className="register"
                />
                <Input
                    label="repeat password"
                    input_type="password"
                    id="repeat_password"
                    name="repeat_password"
                    placeholder="repeat_password"
                    data={userData}
                    error={error}
                    setData={setUserData}
                    className="register"
                />
            </div>
        </form>
    );
};

AccountData.propTypes = {
    initUserData: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    setError: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired,

};

export default AccountData;
