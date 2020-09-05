export const USER_LEVEL_NONE = 1; //无群组
export const USER_LEVEL_COMMON = 2; //成员
export const USER_LEVEL_OWNER = 3; //群主
export const USER_LEVEL_ADMIN = 4; //管理员

/* 获取新闻的5种类型 */
export const NEWS_RANGE_ALL = 20;
export const NEWS_RANGE_GROUP = 21;
export const NEWS_RANGE_MY = 22;
export const NEWS_RANGE_HOT = 23;
export const NEWS_RANGE_OTHER_PUBLIC = 24;

export const NEWS_SEARCH = 26    //已根据关键词返回新闻列表

export const NOTICE_TYPE_REPORT = 30;  //消息类型为用户举报
export const NOTICE_TYPE_PROCESS = 31; //消息为对举报的处理
export const NOTICE_TYPE_ENTER_GROUP = 32; //消息为拉群通知


export const COMMENT_TYPE_FIRST_LIKE = 40;  //一级点赞
export const COMMENT_TYPE_SECOND_LIKE = 41; //二级点赞
export const COMMENT_TYPE_FIRST_COMMENT = 42; //一级评论
export const COMMENT_TYPE_SECOND_COMMENT = 43; //二级评论

export const REGISTRY_SUCCESS = 100;  //注册成功
export const REGISTRY_FAIL = 101;   //注册失败，该用户已存在

export const LOGIN_SUCCESS = 200;    // 登录成功
export const LOGIN_FAIL_EMPTY = 201;   // 登录失败，账号不存在
export const LOGIN_FAIL_ERROR = 202;   // 登录失败，电话或密码错误
export const LOGIN_FAIL_EXPIRE = 203;   // 登录失败，登录状态已失效，请输入电话和密码进行登录

export const GROUP_ADD_SUCCESS = 300;   //部门创建成功
export const EXIT_SUCCESS = 320;    //  退出成功，您已不属于任何部门

export const INVITE_SUCCESS = 310;  //邀请成功，对方已进入您的部门
export const INVITE_FAIL_EMPTY = 311; //邀请失败，您输入的号码不是注册用户
export const INVITE_FAIL_NO_AUTHORITY = 312;    //邀请失败，您没有邀请权限
export const INVITE_FAIL_DUPLICATE = 313;  //邀请失败，对方已加入部门，请先让对方退出既有部门
export const GROUP_ADMIN_INVITE_SUCCESS = 314    //已将目标用户加入目标部门



export const GROUP_LIST_GET_SUCCESS = 340    //已获取到部门列表

export const NEWS_ADD_SUCCESS = 400;    //新闻发布成功

export const NOTICE_ADD_REPORT = 500    //我们已经收到您的举报
export const NOTICE_ADD_FEEDBACK = 501  //根据您的举报，已将相关内容删除
export const NOTICE_ADD_PROCESS = 502   //您发布的内容存在违规，已进行删除处理
export const NOTICE_ADD_ENTER_GROUP = 503   //您已加入部门

export const NOTICE_PROCESS_SUCESS = 504   //已成功处理

export const NOTICE_LIST_REPORT = 506   //已返回未被处理的举报信息
export const NOTICE_LIST_MY = 507  //已返回您的消息列表
export const NOTICE_TOTAL_NEW = 508  //已返回您的未读消息数量


/*


    GROUP_STATE_NORMAL(10,"部门状态正常"),
    GROUP_STATE_DROP(11,"部门已解散"),



    NEWS_SEARCH_NONE(25,"抱歉，未找到相关新闻"),


    
    
    
    EXIT_FAIL_HAVE_MEMBER(321,"退出失败，请先确保部门内其他人全部退出，再尝试解散该群"),
    COLLEAGUE_GET(330,"已获取到同事列表"),
    GROUP_LIST_GET_FAIL(341,"获取部门列表失败，您没有权限"),





    NOTICE_PROCESS_FAIL_DELETE(505,"处理失败，该新闻已被删除"),

    
 */