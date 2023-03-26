import React, { useContext } from "react";
import { Dialog, Box, styled } from "@mui/material";
// components
import Menu from "./menu/Menu";
import EmptyChat from "./chat/EmptyChat";
import ChatBox from "./chat/ChatBox";
import { UserContext } from "../../context/UserProvider";

const Component = styled(Box)`
	display: flex;
`;
const LeftComponent = styled(Box)`
	min-width: 400px;
`;
const RightComponent = styled(Box)`
	width: 73%;
	min-width: 300px;
	height: 100%;
	border-left: 1px solid rgba(0, 0, 0, 0.14);
`;

const dialogStyle = {
	height: "100%", //100% or 95%
	width: "100%",
	margin: "0px", //0px or 20px
	maxWidth: "100%",
	maxHeight: "100%",
	borderRadius: 0,
	boxShadow: "none",
	overflow: "hidden",
};

const ChatDialog = () => {
	const { person } = useContext(UserContext);
	return (
		<Dialog
			open={true}
			PaperProps={{ sx: dialogStyle }}
			hideBackdrop={true}
			maxWidth={"md"}
		>
			<Component>
				<LeftComponent>
					<Menu />
				</LeftComponent>
				<RightComponent>
					{Object.keys(person).length ? <ChatBox /> : <EmptyChat />}
				</RightComponent>
			</Component>
		</Dialog>
	);
};

export default ChatDialog;
