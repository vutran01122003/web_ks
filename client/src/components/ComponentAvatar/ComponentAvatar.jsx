import avatar from '../../assets/images/avatar_default.jpg'
function Avatar({ url, size, className }) {
	return (
		<div className={`info__avatar ${className}`}>
			<img className={`info__avatar-image ${size}`} src={url || avatar} alt="avatar" />
		</div>
	)
}

export default Avatar
