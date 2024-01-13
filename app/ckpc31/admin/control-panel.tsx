'use client';

import React, { useState } from "react";

export default function ControlPanel() {
  const [storyId, setStoryId] = useState(1);
  const [toShowStory, setToShowStory] = useState(true);
  const [statusText, setStatusText] = useState('');

  async function showStory(storyId: number, show: boolean) {
    setStatusText('Sending request...');
    const respose = await fetch(`/api/ckpc31/show-story?story_id=${storyId}&show=${show}`, {
      method: 'POST',
    });

    const actionText = show ? 'show' : 'hide';
    if (!respose.ok) {
      setStatusText(`Fail to ${actionText} story: ${respose.status} ${respose.statusText} (${await respose.text()})`);
      return;
    }
    setStatusText(`Success to ${actionText} story: ${storyId}`);
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    showStory(storyId, toShowStory);
  }

  const handleStoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const storyId = parseInt(event.target.value);
    setStoryId(storyId);
  }

  const handleShowChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const show = event.target.value === 'true';
    setToShowStory(show);
  }

  return (
    <div>
      <select name='story' onChange={handleStoryChange}>
        <option value='1'>第一幕</option>
        <option value='2'>第二幕</option>
        <option value='3'>第三幕</option>
      </select>
      <select name='show' onChange={handleShowChange}>
        <option value='true'>顯示</option>
        <option value='false'>隱藏</option>
      </select>
      <button onClick={handleClick}>送出</button>
      <p>{statusText}</p>
    </div>
  )
}