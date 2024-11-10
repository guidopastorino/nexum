import React from 'react'

type VideoProps = {
  src: string;
}

const Video: React.FC<VideoProps> = ({ src }) => {
  return (
    <video src={src} controls></video>
  )
}

export default Video