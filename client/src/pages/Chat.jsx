import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoSend } from 'react-icons/io5'
import { RiBubbleChartFill } from 'react-icons/ri'
import { sendChat, getTypeChat } from '../redux/actions/chatbotAction'
import { Button } from 'antd'
import { FaArrowDown } from 'react-icons/fa6'
import { chatbotSelector } from '../redux/selector'
import GLOBALTYPES from '../redux/actions/globalTypes'
import Markdown from 'react-markdown'
const Chat = () => {
	const dispatch = useDispatch()
	const chatbot = useSelector(chatbotSelector)
	const chatContainerRef = useRef(null)
	const [question, setQuestion] = useState('')
	const [showScrollButton, setShowScrollButton] = useState(false)
	const [typeChat, setTypeChat] = useState(null)
	useEffect(() => {
		dispatch(getTypeChat())
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [JSON.stringify(chatbot.data)])
	useEffect(() => {
		const chatContainer = chatContainerRef.current
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight
			const handleScroll = () => {
				setShowScrollButton(
					chatContainer.scrollTop < chatContainer.scrollHeight - chatContainer.clientHeight - 200
				)
			}
			chatContainer.addEventListener('scroll', handleScroll)
			return () => {
				chatContainer.removeEventListener('scroll', handleScroll)
			}
		}
	}, [chatContainerRef?.current])

	const sendQuestion = (e) => {
		e.preventDefault()
		if (question && !chatbot.isLoading) {
			dispatch({
				type: GLOBALTYPES.CHATBOT.SET_CHATBOT_DATA,
				payload: {
					key: 'question',
					data: question,
				},
			})
			dispatch(sendChat(question, typeChat))
			setQuestion('')
		}
		return
	}

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			sendQuestion(event)
		}
		return
	}

	const scrollToBottom = () => {
		const chatContainer = chatContainerRef.current
		if (chatContainer) {
			chatContainer.scrollTo({
				top: chatContainer.scrollHeight,
				behavior: 'smooth',
			})
		}
	}

	//Bắt liên kết văn bản trả về từ chatbot
	const TextLink = ({ text }) => {
		const regex = /(https?:\/\/[^\s]+)/g
		const matches = text.split(regex)
		return (
			<div className="chat-text">
				{matches.map((part, index) =>
					index % 2 === 0 ? (
						// Phần tử có chỉ số chẵn là văn bản
						<div key={index}>
							<Markdown>{part}</Markdown>
						</div>
					) : (
						// Phần tử có chỉ số lẻ là liên kết
						<a key={index} href={part} target="_blank">
							{part}
						</a>
					)
				)}
			</div>
		)
	}
	console.log(typeChat)
	const handleTypeChat =
		({ item }) =>
		() => {
			setTypeChat(item)
		}
	return (
		<div className="pageChatbot">
			<div className="chat-content" ref={chatContainerRef}>
				{chatbot.data.length > 0 ? (
					chatbot.data.map((item, index) => (
						<div key={index}>
							<div className="user-question">
								<div className="user-text">{item.question}</div>
							</div>
							{item.answer ? (
								<div className="chat-answer">
									<div className="chat-info">
										<RiBubbleChartFill />{' '}
									</div>
									<TextLink text={item?.answer} />
								</div>
							) : (
								<img
									src={import.meta.env.VITE_APP_CHATBOT_LOADING}
									className="chatbot-loading"
									alt="loading"
								/>
							)}
						</div>
					))
				) : (
					<div className="choice-type">
						{chatbot.typeChat &&
							!typeChat &&
							chatbot.typeChat.map((item, index) => (
								<div key={index} className="choice-type__item" onClick={handleTypeChat({ item })}>
									{item}
								</div>
							))}
					</div>
				)}
			</div>

			<div className="chat-box">
				{showScrollButton && (
					<button className="scroll-to-bottom-button" onClick={scrollToBottom}>
						<FaArrowDown />
					</button>
				)}
				<div className="chat-func">
					<input
						type="text"
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						className="chat-input"
						placeholder="Nhập câu hỏi của bạn tại đây"
						onKeyDown={handleKeyPress}
					/>
					<Button
						type="primary"
						loading={chatbot.isLoading}
						onClick={sendQuestion}
						className={`btn-chat ${!question && 'input-empty'}`}
						disabled={chatbot.isLoading || !question}
					>
						{!chatbot.isLoading && <IoSend />}
					</Button>
				</div>
				<div className="chat-warning">
					Thông tin của IUH chat có thể còn chưa chính xác do còn trong quá trình thử nghiệm
				</div>
			</div>
		</div>
	)
}

export default Chat
