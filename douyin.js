import axios from 'axios'
import getXB from './xbogus.js'

const invalid = /[\\\n\r/:*?\"<>|]/g
const repWith = ``
const DETAIL_URL_BASE = 'https://www.douyin.com/aweme/v1/web/aweme/detail/?'
const USER_AGENT_MOBILE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
// const USER_AGENT_DESKTOP = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
const VIDEO_REGEX = /video\/(\d*)/
const NOTE_REGEX = /note\/(\d*)/

/**
 * 获取作品ID
 * @param {string} url - 抖音短链接。
 * @returns {string} 作品ID
 * @throws {Error} 在请求失败或解析ID时可能会抛出错误。
 */
async function getId(url) {
  const response = await axios.get(url, {
    // headers: { 'user-agent': USER_AGENT_DESKTOP },
  })

  let item_ids

  if (response.request.res.responseUrl.includes('video')) {
    item_ids = VIDEO_REGEX.exec(response.request.res.responseUrl)[1]
  }
  else if (response.request.res.responseUrl.includes('note')) {
    item_ids = NOTE_REGEX.exec(response.request.res.responseUrl)[1]
  }
  else {
    console.error('URL格式不匹配任何已知模式')
    return
  }
  return item_ids
}

/**
 * 根据作品ID和cookie获取作品详细信息
 * @param {string} item_ids - 作品ID。
 * @param {object} cookie - 抖音cookie对象。
 * @param {Function} getXB - 获取XB参数的函数。
 * @returns {object} 作品的详细信息
 * @throws {Error} 在请求失败或解析数据时可能会抛出错误。
 */
async function getInfo(item_ids, cookie, getXB) {
  // 构造请求URL
  const params_url = `aweme_id=${item_ids}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`
  const xb = getXB(params_url)
  const url = `${DETAIL_URL_BASE}${params_url}&X-Bogus=${xb}`

  const response = await axios.get(url, {
    headers: {
      'cookie': `${cookie}`,
      'referer': 'https://www.douyin.com/',
      'user-agent': USER_AGENT_MOBILE,
    },
  })
  if (!response.data)
    return { work: false }
  if (response.data.status_code === 0) {
    const { author, desc, aweme_id, statistics, create_time, music } = response.data.aweme_detail
    const cleanedDesc = desc.replaceAll(invalid, repWith)
    return {
      desc: cleanedDesc,
      nickname: author.nickname,
      video_id: aweme_id,
      music_title: music.title,
      music_author: music.author,
      collect_count: statistics.collect_count,
      comment_count: statistics.comment_count,
      digg_count: statistics.digg_count,
      share_count: statistics.share_count,
      create_time,
    }
  }
  else {
    throw new Error(`Error with status code: ${response.data.status_code}`)
  }
}

export async function useDouyin(url, cookie) {
  const videoId = await getId(url)
  const videoData = await getInfo(videoId, cookie, getXB)
  console.log(videoData)
  return videoData
}
