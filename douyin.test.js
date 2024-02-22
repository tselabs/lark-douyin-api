import axios from 'axios'

async function fetchDouyinData(url, cookie) {
  try {
    const response = await axios.get('http://localhost:3000/douyin', {
      params: {
        url: url,   // 你要传递给后端的抖音视频或笔记的URL
        cookie: cookie  // 抖音cookie
      }
    });
    console.log('Data fetched successfully:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
  }
}

const exampleUrl = 'https://www.douyin.com/video/7322681958658493733';
const exampleCookie = 'ttwid=1%7CpJsQ-0YmBcFJp1rKM1gHrwkcQqeKm9J_EloQHF1oXUY%7C1708425895%7C524e35a1180b788fa0c8b0a277a89fd171ab78d2cd3895604546b5b2804f3691';

fetchDouyinData(exampleUrl, exampleCookie);