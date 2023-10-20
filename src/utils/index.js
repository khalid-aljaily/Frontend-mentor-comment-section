import axios from "axios";




export const deleteData = async (id) => {
  try {
    axios.delete(`http://localhost:3000/comments/${id}`);
  } catch (error) {
    console.error(error);
  }
};



export const upVote = async (id, r) => {
  const serverData = await axios.get(`http://localhost:3000/comments/${id}`);
  if (r) {
    const upVoted = serverData.data.replies.map((reply) => {
      if (reply.id === r.id) {
        reply.score++;
      }
      return reply;
    });
    await axios.patch(`http://localhost:3000/comments/${id}`, {
      replies: upVoted,
    });
  } else {
    const score = serverData.data.score;
    await axios.patch(`http://localhost:3000/comments/${id}`, {
      score: score + 1,
    });
  }
};




export const downVote = async (id, r) => {
  const serverData = await axios.get(`http://localhost:3000/comments/${id}`);
  if (r) {
    const downVoted = serverData.data.replies.map((reply) => {
      if (reply.id === r.id) {
        reply.score--;
      }
      return reply;
    });
    await axios.patch(`http://localhost:3000/comments/${id}`, {
      replies: downVoted,
    });
  } else {
    const score = serverData.data.score;
    score > 0 &&
      (await axios.patch(`http://localhost:3000/comments/${id}`, {
        score: score - 1,
      }));
  }
};




export function getTimeAgo(commentTimestamp) {
  const now = Date.now();
  const commentTime = new Date(commentTimestamp).getTime();
  const timeDifference = now - commentTime;

  // Calculate the time in seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
}
