const videoContainer = document.querySelector('.video-container');
const api_key = "AIzaSyCx5BzbRQkqYqLdPRhsKQ-_gteN-L2iq6s";
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_http = "https://www.googleapis.com/youtube/v3/channels?";

// Функция для выполнения GET-запроса к YouTube API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Функция для получения данных о канале по идентификатору
const getChannelIcon = async (channelId) => {
  const url = channel_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    id: channelId
  });
  const data = await fetchData(url);
  return data.items[0].snippet.thumbnails.default.url;
};

// Функция для создания карточки видео
const makeVideoCard = async (videoData) => {
  const channelThumbnail = await getChannelIcon(videoData.snippet.channelId);

  videoContainer.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${videoData.id}'">
      <img src="${videoData.snippet.thumbnails.high.url}" class="thumbnail">
      <div class="content">
        <img src="${channelThumbnail}" class="channel-icon">
        <div class="info">
          <h4 class="title">${videoData.snippet.title}</h4>
          <p class="channel-name">${videoData.snippet.channelTitle}</p>
        </div>
      </div>
    </div>
  `;
};

// Функция для выполнения поиска по запросу
const searchVideos = () => {
  const searchInput = document.querySelector('.search-bar');
  const searchBtn = document.querySelector('.search-btn');
  const searchLink = "https://www.youtube.com/results?search_query=";

  searchBtn.addEventListener('click', () => {
    if (searchInput.value.length) {
      location.href = searchLink + searchInput.value;
    }
  });
};

// Функция для получения популярных видео
const getPopularVideos = async () => {
  const url = video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 500,
    regionCode: 'UA'
  });
  const data = await fetchData(url);

  data.items.forEach(async (item) => {
    await makeVideoCard(item);
  });
};

// Вызов функций
getPopularVideos();
searchVideos();
