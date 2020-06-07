import Vue from 'vue'

import { library, config } from '@fortawesome/fontawesome-svg-core'
import {
  faStar as faStarS,
  faRetweet,
  faHome,
  faExchangeAlt,
  faComments as faCommentsS,
  faComment,
  faUserPlus,
  faCamera,
  faChartLine,
  faGlobe,
  faInfoCircle,
  faExternalLinkAlt,
  faChevronRight,
  faUsers,
  faSync,
  faPencilAlt,
  faEnvelope,
  faDatabase,
  faChevronDown,
  faPlus,
  faTimes,
  faChartBar,
  faSearch,
  faSpinner,
  faMinus,
  faRssSquare,
  faTrash,
  faBars,
  faPaperPlane,
  faEyeSlash,
  faCheck,
  faEdit as faEditS,
  faReply,
  faRandom,
  faShieldAlt,
  faEllipsisH,
  faBookmark,
  faList,
  faUserCog,
  faUser,
  faUserTimes,
  faPaintBrush,
  faBell as faBellS,
  faCircleNotch,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons'
import {
  faBellSlash,
  faStar as faStarR,
  faHandPointRight,
  faKeyboard,
  faSmile,
  faBell as faBellR,
  faImage,
  faClock,
  faEdit as faEditR,
  faComments as faCommentsR,
  faCheckCircle,
  faCopy,
  faFileVideo,
  faFileAudio,
  faFile,
  faFileImage,
} from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

config.autoAddCss = false

library.add(
  faBellSlash,
  faStarS,
  faStarR,
  faRetweet,
  faHome,
  faExchangeAlt,
  faCommentsS,
  faComment,
  faUserPlus,
  faCamera,
  faChartLine,
  faGlobe,
  faInfoCircle,
  faHandPointRight,
  faGithub,
  faExternalLinkAlt,
  faChevronRight,
  faKeyboard,
  faUsers,
  faSync,
  faPencilAlt,
  faEnvelope,
  faDatabase,
  faChevronDown,
  faPlus,
  faSmile,
  faChartBar,
  faBellS,
  faImage,
  faSearch,
  faSpinner,
  faMinus,
  faRssSquare,
  faTrash,
  faBars,
  faTimes,
  faClock,
  faPaperPlane,
  faEyeSlash,
  faCheck,
  faEditR,
  faEditS,
  faCommentsR,
  faReply,
  faRandom,
  faShieldAlt,
  faEllipsisH,
  faCheckCircle,
  faBookmark,
  faCopy,
  faList,
  faUserCog,
  faUser,
  faUserTimes,
  faPaintBrush,
  faBellR,
  faCircleNotch,
  faExclamationCircle,
  faFileVideo,
  faFileAudio,
  faFile,
  faFileImage
)

Vue.component('font-awesome-icon', FontAwesomeIcon)
