// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body SECTION
const mainBody = {
  gradientColors: "#4484ce, #1ad7c0, #ff9b11, #9b59b6, #ff7f7f, #ecf0f1",
  firstName: "Taro",
  middleName: "",
  lastName: "Nakasone",
  message: " Passionate about changing the world with technology. ",
  icons: [
    {
      image: "fa-github",
      url: "https://github.com/t-na10",
    },
    {
      image: "fa-square-x-twitter",
      url: "https://x.com/de_l_a_1/",
    },
    {
      image: "fa-instagram",
      url: "https://www.instagram.com/nks.__.n/",
    },
    {
      image: "fa-linkedin",
      url: "https://www.linkedin.com/in/taro-nakasone/",
    },

    {
      image: "fa-speaker-deck",
      url: "https://speakerdeck.com/taro_nakasone",
    },
  ],
};

const about = {
  show: true,
  heading: "About Me",
  imageLink: require("./img_nakasone.png"),
  imageSize: 375,
  message: `Data Scientist / NTT communications Co., Ltd.
     Master of Engineering @ [Sakurai Lab](https://www.sakurai-lab.org/)
     MBTI: ENTJ`,
};

const repos = {
  show: true,
  heading: "Recent Projects",
  lengthPerUser: 0,
  specificRepos: [
    { username: "t-na10", repoNames: ["handwriting-generation", "local-llm-ollama-webui", "marker"] },
    { username: "sakurai-lab", repoNames: ["nksn-thesis2024", "paper-retrieval-qa-chat"] }
  ],
};

const experiences = {
  show: true,
  heading: "Experiences",
  data: [
    {
      role: 'AI Engineer(part-time)',
      companylogo: require('../assets/img/EQUES.png'),
      date: 'Feb 2024 – Mar 2025',
    },

    {
      role: 'Leed Engineer(part-time)',
      companylogo: require('../assets/img/EQUES.png'),
      date: 'Jul 2024 – Mar 2025',
    },
    {
      role: 'AI Engineer(part-time)',
      companylogo: require('../assets/img/wacul.png'),
      date: 'Jun 2024 – Mar 2025',
    },
    {
      role: 'Research Assistant(intern)',
      companylogo: require('../assets/img/kubell.png'),
      date: 'Oct 2024 – Mar 2025',
    },

    {
      role: 'Teaching Assistant(part-time)',
      companylogo: require('../assets/img/meiji.png'),
      date: 'Apr 2023 – Mar 2025',
    }
  ]
}

export { navBar, mainBody, about, repos, experiences};
