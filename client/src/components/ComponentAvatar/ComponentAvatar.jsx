import avatar from '../../assets/avatar_default.jpg';

function Avatar({ url, size }) {

    return (
        <div className="info__avatar">
			<img className={`info__avatar-image ${size}`} src={url || avatar} alt='avatar' />
		</div>
    );
}

export default Avatar;
