import React from 'react'

const LineItem = ({ info, text, className }) => {
	return (
		<div className={`line ${className}`}>
			<span>{info}</span>:<p>{text}</p>
		</div>
	)
}
export default LineItem
