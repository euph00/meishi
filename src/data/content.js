import { Github, Linkedin, Twitter, Mail, Globe } from 'lucide-react';

export const content = {
    hero: {
        title: "EUPH",
        subtitle: "今夜 あの空で合流して",
        description: "朝が満たすまでそれぞれの星を探そう",
        logoAlt: "Logo"
    },
    about: {
        heading: "自己紹介 / About",
        bio1: "初星学園プロデューサー科のユーフです。担当は世界で一番かわいい藤田ことねです。",
        bio2: "入学したての新米ですが、担当の魅力を世界に伝え、トップアイドルに導けるよう精進します。どうぞよろしくお願いします！",
        skillsHeading: "活動 / Activities",
        skillsDescription: "主に学園アイドルマスターをやっています。イベント参加などの情報も定期的に更新します。",
        skills: ['NEXT | MOIW2025 / C107', 'Pランキング | 難しいね', 'NIAマスラン | ことね41位', 'maimai/オンゲキ']
    },
    projects: {
        heading: "寄せ書き",
        list: [
            {
                id: 1,
                title: "メッセージを書く",
                category: "Leave a message",
                path: "/leave-message"
            },
            {
                id: 2,
                title: "メッセージ一覧",
                category: "See all messages",
                path: "/messages"
            }
        ]
    },
    social: {
        heading: "",
        links: [
            { icon: Github, href: 'https://github.com/euph00', label: 'GitHub' },
            { icon: Twitter, href: 'https://x.com/e_uph00', label: 'Twitter' },
            { icon: Mail, href: 'mailto:euph.f1eur@gmail.com', label: 'Email' },

        ]
    }
};
