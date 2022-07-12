const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {

    const prefectureList = [
        {
            id: "01",
            name: "北海道",
            short: "北海道",
            kana: "ホッカイドウ",
            en: "hokkaidoken",
            enShort: "hokkaido",
        },
        {
            id: "02",
            name: "青森県",
            short: "青森",
            kana: "アオモリケン",
            en: "aomoriken",
            enShort: "aomori",
        },
        {
            id: "03",
            name: "岩手県",
            short: "岩手",
            kana: "イワテケン",
            en: "iwateken",
            enShort: "iwate",
        },
        {
            id: "04",
            name: "宮城県",
            short: "宮城",
            kana: "ミヤギケン",
            en: "miyagiken",
            enShort: "miyagi",
        },
        {
            id: "05",
            name: "秋田県",
            short: "秋田",
            kana: "アキタケン",
            en: "akitaken",
            enShort: "akita",
        },
        {
            id: "06",
            name: "山形県",
            short: "山形",
            kana: "ヤマガタケン",
            en: "yamagataken",
            enShort: "yamagata",
        },
        {
            id: "07",
            name: "福島県",
            short: "福島",
            kana: "フクシマケン",
            en: "fukushimaken",
            enShort: "fukushima",
        },
        {
            id: "08",
            name: "茨城県",
            short: "茨城",
            kana: "イバラキケン",
            en: "ibarakiken",
            enShort: "ibaraki",
        },
        {
            id: "09",
            name: "栃木県",
            short: "栃木",
            kana: "トチギケン",
            en: "tochigiken",
            enShort: "tochigi",
        },
        {
            id: "10",
            name: "群馬県",
            short: "群馬",
            kana: "グンマケン",
            en: "gunmaken",
            enShort: "gunma",
        },
        {
            id: "11",
            name: "埼玉県",
            short: "埼玉",
            kana: "サイタマケン",
            en: "saitamaken",
            enShort: "saitama",
        },
        {
            id: "12",
            name: "千葉県",
            short: "千葉",
            kana: "チバケン",
            en: "chibaken",
            enShort: "chiba",
        },
        {
            id: "13",
            name: "東京都",
            short: "東京",
            kana: "トウキョウト",
            en: "tokyoken",
            enShort: "tokyo",
        },
        {
            id: "14",
            name: "神奈川県",
            short: "神奈川",
            kana: "カナガワケン",
            en: "kanagawaken",
            enShort: "kanagawa",
        },
        {
            id: "15",
            name: "新潟県",
            short: "新潟",
            kana: "ニイガタケン",
            en: "niigataken",
            enShort: "niigata",
        },
        {
            id: "16",
            name: "富山県",
            short: "富山",
            kana: "トヤマケン",
            en: "toyamaken",
            enShort: "toyama",
        },
        {
            id: "17",
            name: "石川県",
            short: "石川",
            kana: "イシカワケン",
            en: "ishikawaken",
            enShort: "ishikawa",
        },
        {
            id: "18",
            name: "福井県",
            short: "福井",
            kana: "フクイケン",
            en: "fukuiken",
            enShort: "fukui",
        },
        {
            id: "19",
            name: "山梨県",
            short: "山梨",
            kana: "ヤマナシケン",
            en: "yamanashiken",
            enShort: "yamanashi",
        },
        {
            id: "20",
            name: "長野県",
            short: "長野",
            kana: "ナガノケン",
            en: "naganoken",
            enShort: "nagano",
        },
        {
            id: "21",
            name: "岐阜県",
            short: "岐阜",
            kana: "ギフケン",
            en: "gifuken",
            enShort: "gifu",
        },
        {
            id: "22",
            name: "静岡県",
            short: "静岡",
            kana: "シズオカケン",
            en: "shizuokaken",
            enShort: "shizuoka",
        },
        {
            id: "23",
            name: "愛知県",
            short: "愛知",
            kana: "アイチケン",
            en: "aichiken",
            enShort: "aichi",
        },
        {
            id: "24",
            name: "三重県",
            short: "三重",
            kana: "ミエケン",
            en: "mieken",
            enShort: "mie",
        },
        {
            id: "25",
            name: "滋賀県",
            short: "滋賀",
            kana: "シガケン",
            en: "shigaken",
            enShort: "shiga",
        },
        {
            id: "26",
            name: "京都府",
            short: "京都",
            kana: "キョウトフ",
            en: "kyotoken",
            enShort: "kyoto",
        },
        {
            id: "27",
            name: "大阪府",
            short: "大阪",
            kana: "オオサカフ",
            en: "osakaken",
            enShort: "osaka",
        },
        {
            id: "28",
            name: "兵庫県",
            short: "兵庫",
            kana: "ヒョウゴケン",
            en: "hyogoken",
            enShort: "hyogo",
        },
        {
            id: "29",
            name: "奈良県",
            short: "奈良",
            kana: "ナラケン",
            en: "naraken",
            enShort: "nara",
        },
        {
            id: "30",
            name: "和歌山県",
            short: "和歌山",
            kana: "ワカヤマケン",
            en: "wakayamaken",
            enShort: "wakayama",
        },
        {
            id: "31",
            name: "鳥取県",
            short: "鳥取",
            kana: "トットリケン",
            en: "tottoriken",
            enShort: "tottori",
        },
        {
            id: "32",
            name: "島根県",
            short: "島根",
            kana: "シマネケン",
            en: "shimaneken",
            enShort: "shimane",
        },
        {
            id: "33",
            name: "岡山県",
            short: "岡山",
            kana: "オカヤマケン",
            en: "okayamaken",
            enShort: "okayama",
        },
        {
            id: "34",
            name: "広島県",
            short: "広島",
            kana: "ヒロシマケン",
            en: "hiroshimaken",
            enShort: "hiroshima",
        },
        {
            id: "35",
            name: "山口県",
            short: "山口",
            kana: "ヤマグチケン",
            en: "yamaguchiken",
            enShort: "yamaguchi",
        },
        {
            id: "36",
            name: "徳島県",
            short: "徳島",
            kana: "トクシマケン",
            en: "tokushimaken",
            enShort: "tokushima",
        },
        {
            id: "37",
            name: "香川県",
            short: "香川",
            kana: "カガワケン",
            en: "kagawaken",
            enShort: "kagawa",
        },
        {
            id: "38",
            name: "愛媛県",
            short: "愛媛",
            kana: "エヒメケン",
            en: "ehimeken",
            enShort: "ehime",
        },
        {
            id: "39",
            name: "高知県",
            short: "高知",
            kana: "コウチケン",
            en: "kochiken",
            enShort: "kochi",
        },
        {
            id: "40",
            name: "福岡県",
            short: "福岡",
            kana: "フクオカケン",
            en: "fukuokaken",
            enShort: "fukuoka",
        },
        {
            id: "41",
            name: "佐賀県",
            short: "佐賀",
            kana: "サガケン",
            en: "sagaken",
            enShort: "saga",
        },
        {
            id: "42",
            name: "長崎県",
            short: "長崎",
            kana: "ナガサキケン",
            en: "nagasakiken",
            enShort: "nagasaki",
        },
        {
            id: "43",
            name: "熊本県",
            short: "熊本",
            kana: "クマモトケン",
            en: "kumamotoken",
            enShort: "kumamoto",
        },
        {
            id: "44",
            name: "大分県",
            short: "大分",
            kana: "オオイタケン",
            en: "oitaken",
            enShort: "oita",
        },
        {
            id: "45",
            name: "宮崎県",
            short: "宮崎",
            kana: "ミヤザキケン",
            en: "miyazakiken",
            enShort: "miyazaki",
        },
        {
            id: "46",
            name: "鹿児島県",
            short: "鹿児島",
            kana: "カゴシマケン",
            en: "kagoshimaken",
            enShort: "kagoshima",
        },
        {
            id: "47",
            name: "沖縄県",
            short: "沖縄",
            kana: "オキナワケン",
            en: "okinawaken",
            enShort: "okinawa",
        }
    ]


    const hubspotClient = new hubspot.Client({
        apiKey: process.env.HAPIKEY
    });
    const results = await hubspotClient.crm.contacts.basicApi.getById(event.object.objectId, ['state'])

    /// コンタクトの今の都道府県
    const currentState = results.body.properties.state
    const lowercaseCurrentState = currentState.toLowerCase().replace(/[ぁ-ん]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60));

    /// このアクションのアウトプットが入る変数
    let state

    loop1:
    for (const prefectureMap of prefectureList) { /// 上の都道府県リスト一個一個をループし、該当する値がないかチェックする
        for (const prefectureString of Object.values(prefectureMap)) {
            if (prefectureString.includes(lowercaseCurrentState)) {
                /**
                 * 該当する値があった場合はアウトプットする値としてname(日本語表記)をインプットする
                 * 日本語以外の表記に変換したい場合は'.name'を'.en'や'.enShort'に変えれば英語表記だったりにできる
                */
                state = prefectureMap.name
                break loop1
            }
        }
    }

    /// もし該当する値がなかった場合は今の都道府県をそのまま返す
    if(!state) {
        state = currentState
    }

    callback({
        outputFields: {
            state,
        }
    });
}

// Original author: Tyler Gunji (https://gist.github.com/dshukertjr)
