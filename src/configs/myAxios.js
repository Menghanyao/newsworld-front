import axios from "axios";
async function getData(url = '', data = {}, type = 'POST', method = 'JSON') {
    type = type.toUpperCase();
    url = 'http://localhost:8081' + url;
    
    if (type == 'POST' && method == 'JSON') {
		data = JSON.stringify(data)
	}

    console.log("1 requestData:", data)
    let result = await axios({
        headers: {
            'Content-Type': method == 'JSON' ? 'application/json' : 'multipart/form-data'
        },
        method: type,
        url: url,
        data: data
    }).then((response) => {          //这里使用了ES6的语法
        console.log("2 url:", url)
        console.log("3 axios.response:", response)       //请求成功返回的数据
        return response.data
    }).catch((error) => {
        console.log(error)       //请求失败返回的数据
    })

    return result
}



/**
* 下面是接口,19个
*/

/**
 * 普通用户注册
 */
export const addUser = user => getData('/addUser', user);


/**
 * 普通用户注册
 */
export const addAdmin = user => getData('/addAdmin', user);

/**
 * 登录
 */
export const login = user => getData('/login', user);

/**
 * 创建部门
 */
export const addGroup = group => getData('/addGroup', group);


/**
 * 获取用户信息
 */
export const getUser = userId => getData('/getUser', userId);

/**
 * 获取部门信息
 */
export const getGroup = groupId => getData('/getGroup', groupId);

/**
 * 获取新闻信息
 */
export const getNews = newsId => getData('/getNews', newsId);


/**
 * 部门主管邀请成员
 * 需要：主管userId，成员userPhone
 */
export const invite = user => getData('/invite', user);

/**
 * 成员自己退出部门
 * 部门管理员在仅剩自己时解散部门
 */
export const exitGroup = user => getData('/exitGroup', user);

/**
 * 获取部门同事列表
 */
export const colleagueList = user => getData('/colleagueList', user);

/**
* 添加新闻
*/
export const addNews = news => getData('/addNews', news);

/**
* 阅读新闻
*/
export const readNews = news => getData('/readNews', news);

/**
* 返回首页新闻列表，type = 20
* 返回部门新闻列表，type = 21
* 返回我的新闻列表，type = 22
* 返回热门新闻列表，type = 23
*/
export const newsList = pagination => getData('/newsList', pagination);



/**
* 举报新闻
*/
export const addReport = notice => getData('/addReport', notice);

/**
* 管理员删除新闻，并向双发发送消息
*/
export const addProcess = notice => getData('/addProcess', notice);

/**
* 获取消息通知
    用户和管理员均使用此接口
*/
export const noticeListInterface = pagination => getData('/noticeList', pagination);

/**
* 阅读消息
*/
export const readNotice = notice => getData('/readNotice', notice);

/**
* 管理员返回部门列表
*/
export const groupList = pagination => getData('/groupList', pagination);

/**
 * 管理员向某个部门里添加成员
 * 需要管理员userId，目标部门groupId，成员电话userPhone
 */
export const addMember = user => getData('/addMember', user);

/**
* 搜索新闻
*/
export const searchList = pagination => getData('/searchList', pagination);

/**
* 未读消息数
*/
export const noticeUnreadTotal = user => getData('/noticeUnreadTotal', user);

/**
* imgUpload
*/
export const imgUpload = file => getData('/imgUpload', file, 'POST', "form-data");



/**
* 获取一级点赞数
*/
export const getNewsLikeCount = news => getData('/getNewsLikeCount', news);


/**
* 获取一级点赞列表
*/
export const getFirstLikeList = news => getData('/getFirstLikeList', news);


/**
* 获取一级评论列表
*/
export const getFirstCommentList = news => getData('/getFirstCommentList', news);



/**
* 获取二级点赞数
*/
export const getSecondLikeCount = comment => getData('/getSecondLikeCount', comment);


/**
* 获取二级点赞列表
*/
export const getSecondLikeList = comment => getData('/getSecondLikeList', comment);


/**
* 获取二级评论列表
*/
export const getSecondCommentList = comment => getData('/getSecondCommentList', comment);

/**
* 添加一二级评论，一二级点赞
*/
export const addComment = comment => getData('/addComment', comment);


/**
* 取消点赞
*/
export const cancelLike = comment => getData('/cancelLike', comment);

/**
 * 时间戳转时间
 */
export const timestampToTime = timestamp => {
    let date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    let h = date.getHours() + ':'
    let m = date.getMinutes() + ':'
    let s = date.getSeconds()
    return Y + M + D + h + m + s
}