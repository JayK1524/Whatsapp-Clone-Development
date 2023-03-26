import React, { useContext, useEffect, useState, useRef } from "react";
import { Box, styled } from "@mui/material";
import Footer from "./Footer";
import Message from "./Message";
import { getMessage, newMessage } from "../../../service/api";
import { AccountContext } from "../../../context/AccountProvider";
const Wrapper = styled(Box)`
	background-image: url(${"https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"});
	background-size: 50%;
`;

const Component = styled(Box)`
	height: 80vh;
	overflow-y: scroll;
`;

const ContainerBox = styled(Box)`
	padding: 1px 80px;
`;

const Messages = ({ person, conversation }) => {
	// states //
	const [value, setValue] = useState("");
	const [messages, setMessages] = useState([]);
	const [file, setFile] = useState("");
	const [image, setImage] = useState("");
	const [incomingMessage, setIncomingMessage] = useState(null);

	const scrollRef = useRef(); // scrollBar ref //

	const { account, socket, newMessageFlag, setNewMessageFlag } =
		useContext(AccountContext);

	useEffect(() => {
		socket.current.on("getMessage", (data) => {
			setIncomingMessage({
				...data,
				createdAt: Date.now(),
			});
		});
	}, [socket]);

	// getting messages from db through api using useEffect //
	useEffect(() => {
		const getMessageDetails = async () => {
			let data = await getMessage(conversation?._id);
			setMessages(data);
			console.log(data);
		};
		conversation?._id && getMessageDetails();
	}, [conversation?._id, person._id, newMessageFlag]);

	// scrollBar //
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ transition: "smooth" });
	}, [messages]);

	useEffect(() => {
		incomingMessage &&
			conversation?.members?.includes(incomingMessage.senderId) &&
			setMessages((prev) => [...prev, incomingMessage]);
	}, [incomingMessage, conversation]);

	const receiverId = conversation?.members?.find(
		(member) => member !== account.sub
	);

	const sendText = async (e) => {
		let code = e.keyCode || e.which;
		if (!value) return;

		if (code === 13) {
			let message = {};
			if (!file) {
				message = {
					senderId: account.sub,
					receiverId: receiverId,
					conversationId: conversation._id,
					type: "text",
					text: value,
				};
			} else {
				message = {
					senderId: account.sub,
					receiverId: receiverId,
					conversationId: conversation._id,
					type: "file",
					text: image,
				};
			}

			socket.current.emit("sendMessage", message);

			await newMessage(message);
			setValue("");
			setFile("");
			setImage("");
			setNewMessageFlag((prev) => !prev);
		}
	};

	return (
		<Wrapper>
			<Component>
				{messages &&
					messages.map((message) => (
						<ContainerBox ref={scrollRef}>
							<Message message={message} />
						</ContainerBox>
					))}
			</Component>
			<Footer
				value={value}
				setValue={setValue}
				sendText={sendText}
				file={file}
				setFile={setFile}
				setImage={setImage}
			/>
		</Wrapper>
	);
};

export default Messages;
