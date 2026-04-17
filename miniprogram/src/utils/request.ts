import Taro from '@tarojs/taro';

const BASE_URL = 'http://localhost:3000/api';

export async function request(url: string, method: string = 'GET', data: any = null) {
  const token = Taro.getStorageSync('token');
  
  const header: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    header['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await Taro.request({
      url: BASE_URL + url,
      method,
      data,
      header
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || '请求失败');
    }
  } catch (error: any) {
    console.error('请求失败:', error);
    throw error.message || '网络请求失败';
  }
}

export function getTimeSlot(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}
