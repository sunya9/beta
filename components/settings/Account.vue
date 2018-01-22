<template>
  <div>
    <h3 class="card-title mb-4">
      Account
    </h3>
    <h4 class="card-subtitle">Profile</h4>
    <form @submit.prevent="update" action="/proxy/users/me" method="post">
      <input type="hidden" name="_method" value="patch">
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="name">
          Name
        </label>
        <div class="col-sm-12 col-md-9">
          <input type="text" id="name" name="name" v-model="name" class="form-control">
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="description">
          Description
        </label>
        <div class="col-sm-12 col-md-9">
          <textarea v-model="description" name="content[text]" cols="30" rows="7" id="description" class="form-control"></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-form-label col-sm-12 col-md-3" for="timezone">
          Timezone
        </label>
        <div class="col-sm-12 col-md-9">
          <select v-model="timezone" name="timezone" cols="30" rows="7" id="timezone" class="form-control">
            <option>Africa/Abidjan</option>
            <option>Africa/Accra</option>
            <option>Africa/Addis_Ababa</option>
            <option>Africa/Algiers</option>
            <option>Africa/Asmara</option>
            <option>Africa/Bamako</option>
            <option>Africa/Bangui</option>
            <option>Africa/Banjul</option>
            <option>Africa/Bissau</option>
            <option>Africa/Blantyre</option>
            <option>Africa/Brazzaville</option>
            <option>Africa/Bujumbura</option>
            <option>Africa/Cairo</option>
            <option>Africa/Casablanca</option>
            <option>Africa/Ceuta</option>
            <option>Africa/Conakry</option>
            <option>Africa/Dakar</option>
            <option>Africa/Dar_es_Salaam</option>
            <option>Africa/Djibouti</option>
            <option>Africa/Douala</option>
            <option>Africa/El_Aaiun</option>
            <option>Africa/Freetown</option>
            <option>Africa/Gaborone</option>
            <option>Africa/Harare</option>
            <option>Africa/Johannesburg</option>
            <option>Africa/Juba</option>
            <option>Africa/Kampala</option>
            <option>Africa/Khartoum</option>
            <option>Africa/Kigali</option>
            <option>Africa/Kinshasa</option>
            <option>Africa/Lagos</option>
            <option>Africa/Libreville</option>
            <option>Africa/Lome</option>
            <option>Africa/Luanda</option>
            <option>Africa/Lubumbashi</option>
            <option>Africa/Lusaka</option>
            <option>Africa/Malabo</option>
            <option>Africa/Maputo</option>
            <option>Africa/Maseru</option>
            <option>Africa/Mbabane</option>
            <option>Africa/Mogadishu</option>
            <option>Africa/Monrovia</option>
            <option>Africa/Nairobi</option>
            <option>Africa/Ndjamena</option>
            <option>Africa/Niamey</option>
            <option>Africa/Nouakchott</option>
            <option>Africa/Ouagadougou</option>
            <option>Africa/Porto-Novo</option>
            <option>Africa/Sao_Tome</option>
            <option>Africa/Tripoli</option>
            <option>Africa/Tunis</option>
            <option>Africa/Windhoek</option>
            <option>America/Adak</option>
            <option>America/Anchorage</option>
            <option>America/Anguilla</option>
            <option>America/Antigua</option>
            <option>America/Araguaina</option>
            <option>America/Argentina/Buenos_Aires</option>
            <option>America/Argentina/Catamarca</option>
            <option>America/Argentina/Cordoba</option>
            <option>America/Argentina/Jujuy</option>
            <option>America/Argentina/La_Rioja</option>
            <option>America/Argentina/Mendoza</option>
            <option>America/Argentina/Rio_Gallegos</option>
            <option>America/Argentina/Salta</option>
            <option>America/Argentina/San_Juan</option>
            <option>America/Argentina/San_Luis</option>
            <option>America/Argentina/Tucuman</option>
            <option>America/Argentina/Ushuaia</option>
            <option>America/Aruba</option>
            <option>America/Asuncion</option>
            <option>America/Atikokan</option>
            <option>America/Bahia</option>
            <option>America/Bahia_Banderas</option>
            <option>America/Barbados</option>
            <option>America/Belem</option>
            <option>America/Belize</option>
            <option>America/Blanc-Sablon</option>
            <option>America/Boa_Vista</option>
            <option>America/Bogota</option>
            <option>America/Boise</option>
            <option>America/Cambridge_Bay</option>
            <option>America/Campo_Grande</option>
            <option>America/Cancun</option>
            <option>America/Caracas</option>
            <option>America/Cayenne</option>
            <option>America/Cayman</option>
            <option>America/Chicago</option>
            <option>America/Chihuahua</option>
            <option>America/Costa_Rica</option>
            <option>America/Creston</option>
            <option>America/Cuiaba</option>
            <option>America/Curacao</option>
            <option>America/Danmarkshavn</option>
            <option>America/Dawson</option>
            <option>America/Dawson_Creek</option>
            <option>America/Denver</option>
            <option>America/Detroit</option>
            <option>America/Dominica</option>
            <option>America/Edmonton</option>
            <option>America/Eirunepe</option>
            <option>America/El_Salvador</option>
            <option>America/Fort_Nelson</option>
            <option>America/Fortaleza</option>
            <option>America/Glace_Bay</option>
            <option>America/Godthab</option>
            <option>America/Goose_Bay</option>
            <option>America/Grand_Turk</option>
            <option>America/Grenada</option>
            <option>America/Guadeloupe</option>
            <option>America/Guatemala</option>
            <option>America/Guayaquil</option>
            <option>America/Guyana</option>
            <option>America/Halifax</option>
            <option>America/Havana</option>
            <option>America/Hermosillo</option>
            <option>America/Indiana/Indianapolis</option>
            <option>America/Indiana/Knox</option>
            <option>America/Indiana/Marengo</option>
            <option>America/Indiana/Petersburg</option>
            <option>America/Indiana/Tell_City</option>
            <option>America/Indiana/Vevay</option>
            <option>America/Indiana/Vincennes</option>
            <option>America/Indiana/Winamac</option>
            <option>America/Inuvik</option>
            <option>America/Iqaluit</option>
            <option>America/Jamaica</option>
            <option>America/Juneau</option>
            <option>America/Kentucky/Louisville</option>
            <option>America/Kentucky/Monticello</option>
            <option>America/Kralendijk</option>
            <option>America/La_Paz</option>
            <option>America/Lima</option>
            <option>America/Los_Angeles</option>
            <option>America/Lower_Princes</option>
            <option>America/Maceio</option>
            <option>America/Managua</option>
            <option>America/Manaus</option>
            <option>America/Marigot</option>
            <option>America/Martinique</option>
            <option>America/Matamoros</option>
            <option>America/Mazatlan</option>
            <option>America/Menominee</option>
            <option>America/Merida</option>
            <option>America/Metlakatla</option>
            <option>America/Mexico_City</option>
            <option>America/Miquelon</option>
            <option>America/Moncton</option>
            <option>America/Monterrey</option>
            <option>America/Montevideo</option>
            <option>America/Montserrat</option>
            <option>America/Nassau</option>
            <option>America/New_York</option>
            <option>America/Nipigon</option>
            <option>America/Nome</option>
            <option>America/Noronha</option>
            <option>America/North_Dakota/Beulah</option>
            <option>America/North_Dakota/Center</option>
            <option>America/North_Dakota/New_Salem</option>
            <option>America/Ojinaga</option>
            <option>America/Panama</option>
            <option>America/Pangnirtung</option>
            <option>America/Paramaribo</option>
            <option>America/Phoenix</option>
            <option>America/Port-au-Prince</option>
            <option>America/Port_of_Spain</option>
            <option>America/Porto_Velho</option>
            <option>America/Puerto_Rico</option>
            <option>America/Punta_Arenas</option>
            <option>America/Rainy_River</option>
            <option>America/Rankin_Inlet</option>
            <option>America/Recife</option>
            <option>America/Regina</option>
            <option>America/Resolute</option>
            <option>America/Rio_Branco</option>
            <option>America/Santarem</option>
            <option>America/Santiago</option>
            <option>America/Santo_Domingo</option>
            <option>America/Sao_Paulo</option>
            <option>America/Scoresbysund</option>
            <option>America/Sitka</option>
            <option>America/St_Barthelemy</option>
            <option>America/St_Johns</option>
            <option>America/St_Kitts</option>
            <option>America/St_Lucia</option>
            <option>America/St_Thomas</option>
            <option>America/St_Vincent</option>
            <option>America/Swift_Current</option>
            <option>America/Tegucigalpa</option>
            <option>America/Thule</option>
            <option>America/Thunder_Bay</option>
            <option>America/Tijuana</option>
            <option>America/Toronto</option>
            <option>America/Tortola</option>
            <option>America/Vancouver</option>
            <option>America/Whitehorse</option>
            <option>America/Winnipeg</option>
            <option>America/Yakutat</option>
            <option>America/Yellowknife</option>
            <option>Antarctica/Casey</option>
            <option>Antarctica/Davis</option>
            <option>Antarctica/DumontDUrville</option>
            <option>Antarctica/Macquarie</option>
            <option>Antarctica/Mawson</option>
            <option>Antarctica/McMurdo</option>
            <option>Antarctica/Palmer</option>
            <option>Antarctica/Rothera</option>
            <option>Antarctica/Syowa</option>
            <option>Antarctica/Troll</option>
            <option>Antarctica/Vostok</option>
            <option>Arctic/Longyearbyen</option>
            <option>Asia/Aden</option>
            <option>Asia/Almaty</option>
            <option>Asia/Amman</option>
            <option>Asia/Anadyr</option>
            <option>Asia/Aqtau</option>
            <option>Asia/Aqtobe</option>
            <option>Asia/Ashgabat</option>
            <option>Asia/Atyrau</option>
            <option>Asia/Baghdad</option>
            <option>Asia/Bahrain</option>
            <option>Asia/Baku</option>
            <option>Asia/Bangkok</option>
            <option>Asia/Barnaul</option>
            <option>Asia/Beirut</option>
            <option>Asia/Bishkek</option>
            <option>Asia/Brunei</option>
            <option>Asia/Chita</option>
            <option>Asia/Choibalsan</option>
            <option>Asia/Colombo</option>
            <option>Asia/Damascus</option>
            <option>Asia/Dhaka</option>
            <option>Asia/Dili</option>
            <option>Asia/Dubai</option>
            <option>Asia/Dushanbe</option>
            <option>Asia/Famagusta</option>
            <option>Asia/Gaza</option>
            <option>Asia/Hebron</option>
            <option>Asia/Ho_Chi_Minh</option>
            <option>Asia/Hong_Kong</option>
            <option>Asia/Hovd</option>
            <option>Asia/Irkutsk</option>
            <option>Asia/Jakarta</option>
            <option>Asia/Jayapura</option>
            <option>Asia/Jerusalem</option>
            <option>Asia/Kabul</option>
            <option>Asia/Kamchatka</option>
            <option>Asia/Karachi</option>
            <option>Asia/Kathmandu</option>
            <option>Asia/Khandyga</option>
            <option>Asia/Kolkata</option>
            <option>Asia/Krasnoyarsk</option>
            <option>Asia/Kuala_Lumpur</option>
            <option>Asia/Kuching</option>
            <option>Asia/Kuwait</option>
            <option>Asia/Macau</option>
            <option>Asia/Magadan</option>
            <option>Asia/Makassar</option>
            <option>Asia/Manila</option>
            <option>Asia/Muscat</option>
            <option>Asia/Nicosia</option>
            <option>Asia/Novokuznetsk</option>
            <option>Asia/Novosibirsk</option>
            <option>Asia/Omsk</option>
            <option>Asia/Oral</option>
            <option>Asia/Phnom_Penh</option>
            <option>Asia/Pontianak</option>
            <option>Asia/Pyongyang</option>
            <option>Asia/Qatar</option>
            <option>Asia/Qyzylorda</option>
            <option>Asia/Riyadh</option>
            <option>Asia/Sakhalin</option>
            <option>Asia/Samarkand</option>
            <option>Asia/Seoul</option>
            <option>Asia/Shanghai</option>
            <option>Asia/Singapore</option>
            <option>Asia/Srednekolymsk</option>
            <option>Asia/Taipei</option>
            <option>Asia/Tashkent</option>
            <option>Asia/Tbilisi</option>
            <option>Asia/Tehran</option>
            <option>Asia/Thimphu</option>
            <option>Asia/Tokyo</option>
            <option>Asia/Tomsk</option>
            <option>Asia/Ulaanbaatar</option>
            <option>Asia/Urumqi</option>
            <option>Asia/Ust-Nera</option>
            <option>Asia/Vientiane</option>
            <option>Asia/Vladivostok</option>
            <option>Asia/Yakutsk</option>
            <option>Asia/Yangon</option>
            <option>Asia/Yekaterinburg</option>
            <option>Asia/Yerevan</option>
            <option>Atlantic/Azores</option>
            <option>Atlantic/Bermuda</option>
            <option>Atlantic/Canary</option>
            <option>Atlantic/Cape_Verde</option>
            <option>Atlantic/Faroe</option>
            <option>Atlantic/Madeira</option>
            <option>Atlantic/Reykjavik</option>
            <option>Atlantic/South_Georgia</option>
            <option>Atlantic/St_Helena</option>
            <option>Atlantic/Stanley</option>
            <option>Australia/Adelaide</option>
            <option>Australia/Brisbane</option>
            <option>Australia/Broken_Hill</option>
            <option>Australia/Currie</option>
            <option>Australia/Darwin</option>
            <option>Australia/Eucla</option>
            <option>Australia/Hobart</option>
            <option>Australia/Lindeman</option>
            <option>Australia/Lord_Howe</option>
            <option>Australia/Melbourne</option>
            <option>Australia/Perth</option>
            <option>Australia/Sydney</option>
            <option>Europe/Amsterdam</option>
            <option>Europe/Andorra</option>
            <option>Europe/Astrakhan</option>
            <option>Europe/Athens</option>
            <option>Europe/Belgrade</option>
            <option>Europe/Berlin</option>
            <option>Europe/Bratislava</option>
            <option>Europe/Brussels</option>
            <option>Europe/Bucharest</option>
            <option>Europe/Budapest</option>
            <option>Europe/Busingen</option>
            <option>Europe/Chisinau</option>
            <option>Europe/Copenhagen</option>
            <option>Europe/Dublin</option>
            <option>Europe/Gibraltar</option>
            <option>Europe/Guernsey</option>
            <option>Europe/Helsinki</option>
            <option>Europe/Isle_of_Man</option>
            <option>Europe/Istanbul</option>
            <option>Europe/Jersey</option>
            <option>Europe/Kaliningrad</option>
            <option>Europe/Kiev</option>
            <option>Europe/Kirov</option>
            <option>Europe/Lisbon</option>
            <option>Europe/Ljubljana</option>
            <option>Europe/London</option>
            <option>Europe/Luxembourg</option>
            <option>Europe/Madrid</option>
            <option>Europe/Malta</option>
            <option>Europe/Mariehamn</option>
            <option>Europe/Minsk</option>
            <option>Europe/Monaco</option>
            <option>Europe/Moscow</option>
            <option>Europe/Oslo</option>
            <option>Europe/Paris</option>
            <option>Europe/Podgorica</option>
            <option>Europe/Prague</option>
            <option>Europe/Riga</option>
            <option>Europe/Rome</option>
            <option>Europe/Samara</option>
            <option>Europe/San_Marino</option>
            <option>Europe/Sarajevo</option>
            <option>Europe/Saratov</option>
            <option>Europe/Simferopol</option>
            <option>Europe/Skopje</option>
            <option>Europe/Sofia</option>
            <option>Europe/Stockholm</option>
            <option>Europe/Tallinn</option>
            <option>Europe/Tirane</option>
            <option>Europe/Ulyanovsk</option>
            <option>Europe/Uzhgorod</option>
            <option>Europe/Vaduz</option>
            <option>Europe/Vatican</option>
            <option>Europe/Vienna</option>
            <option>Europe/Vilnius</option>
            <option>Europe/Volgograd</option>
            <option>Europe/Warsaw</option>
            <option>Europe/Zagreb</option>
            <option>Europe/Zaporozhye</option>
            <option>Europe/Zurich</option>
            <option>Indian/Antananarivo</option>
            <option>Indian/Chagos</option>
            <option>Indian/Christmas</option>
            <option>Indian/Cocos</option>
            <option>Indian/Comoro</option>
            <option>Indian/Kerguelen</option>
            <option>Indian/Mahe</option>
            <option>Indian/Maldives</option>
            <option>Indian/Mauritius</option>
            <option>Indian/Mayotte</option>
            <option>Indian/Reunion</option>
            <option>Pacific/Apia</option>
            <option>Pacific/Auckland</option>
            <option>Pacific/Bougainville</option>
            <option>Pacific/Chatham</option>
            <option>Pacific/Chuuk</option>
            <option>Pacific/Easter</option>
            <option>Pacific/Efate</option>
            <option>Pacific/Enderbury</option>
            <option>Pacific/Fakaofo</option>
            <option>Pacific/Fiji</option>
            <option>Pacific/Funafuti</option>
            <option>Pacific/Galapagos</option>
            <option>Pacific/Gambier</option>
            <option>Pacific/Guadalcanal</option>
            <option>Pacific/Guam</option>
            <option>Pacific/Honolulu</option>
            <option>Pacific/Kiritimati</option>
            <option>Pacific/Kosrae</option>
            <option>Pacific/Kwajalein</option>
            <option>Pacific/Majuro</option>
            <option>Pacific/Marquesas</option>
            <option>Pacific/Midway</option>
            <option>Pacific/Nauru</option>
            <option>Pacific/Niue</option>
            <option>Pacific/Norfolk</option>
            <option>Pacific/Noumea</option>
            <option>Pacific/Pago_Pago</option>
            <option>Pacific/Palau</option>
            <option>Pacific/Pitcairn</option>
            <option>Pacific/Pohnpei</option>
            <option>Pacific/Port_Moresby</option>
            <option>Pacific/Rarotonga</option>
            <option>Pacific/Saipan</option>
            <option>Pacific/Tahiti</option>
            <option>Pacific/Tarawa</option>
            <option>Pacific/Tongatapu</option>
            <option>Pacific/Wake</option>
            <option>Pacific/Wallis</option>
          </select>
        </div>

        <label class="col-form-label col-sm-12 col-md-3" for="locale">
          Language
        </label>
        <div class="col-sm-12 col-md-9">
          <select v-model="locale" name="locale" cols="30" rows="7" id="locale" class="form-control">
            <option value="ar_SA">لعربية (ar_SA)</option>
            <option value="bg_BG">български (bg_BG)</option>
            <option value="cs_CZ">česky (cs_CZ)</option>
            <option value="da_DK">dansk (da_DK)</option>
            <option value="de_DE">Deutsche (de_DE)</option>
            <option value="en_GB">English (en_GB)</option>
            <option value="en_US">English (en_US)</option>
            <option value="es_ES">Español (es_ES)</option>
            <option value="fi_FI">Suomalainen (fi_FI)</option>
            <option value="fr_FR">français (fr_FR)</option>
            <option value="gl_ES">Galego (gl_ES)</option>
            <option value="hu_HU">Magyar (hu_HU)</option>
            <option value="it_IT">italiano (it_IT)</option>
            <option value="ja_JP">日本語 (ja_JP)</option>
            <option value="ko_KR">한국어 (ko_KR)</option>
            <option value="lv_LV">Latviešu (lv_LV)</option>
            <option value="nl_NL">Nederlands (nl_NL)</option>
            <option value="pl_PL">polsku (pl_PL)</option>
            <option value="pt_BR">português (pt_BR)</option>
            <option value="ru_RU">русский (ru_RU)</option>
            <option value="sq_AL">shqiptar (sq_AL)</option>
            <option value="sr_SP">Сербский (sr_SP)</option>
            <option value="sv_SE">svenska (sv_SE)</option>
            <option value="tr_TR">Türk (tr_TR)</option>
            <option value="uk_UA">Українська (uk_UA)</option>
            <option value="zh_CN">中文 (zh_CN)</option>
            <option value="zh_HK">中文 (zh_HK)</option>
            <option value="zh_TW">中文 (zh_TW)</option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="ml-md-auto col-md-9">
          <submit-button />
        </div>
      </div>
    </form>
    <div v-if="false">
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h4>Cover</h4>
        </div>
        <div class="col-sm-12 col-md-9">
          <div class="form-group">
            <img :src="cover.link"
              :width="cover.width" :height="cover.height"
              alt="cover image" class="img-fluid">
          </div>
          <div class="form-group">
            <input
              type="file"
              accept="image/*"
              @change="coverChanged"
              style="display: none"
              ref="coverFileInput">
            <button
              type="button"
              @click="changeCover"
              class="btn btn-secondary mr-2">
              Change cover
            </button>
            {{coverMessage}}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-3">
          <h4>Avatar</h4>
        </div>
        <div class="col-ms-12 col-md-9">
          <div class="form-group">
            <img :src="avatar.link"
              width="128" height="128"
              alt="avatar image">
          </div>
          <div class="form-group">
            <input
              type="file"
              @change="avatarChanged"
              accept="image/*"
              style="display: none"
              ref="avatarFileInput">
            <button
              type="button"
              @click="changeAvatar"
              class="btn btn-secondary mr-2">
              Change avatar
            </button>
            {{avatarMessage}}
          </div>
        </div>
      </div>
    </div>
    <!-- <crop-modal ref="cropModal" /> -->
  </div>
</template>

<script>
import api from '~/plugins/api'
import SubmitButton from '~/components/SubmitButton'
// import CropModal from '~/components/CropModal'

export default {
  props: {
    account: {}
  },
  data() {
    return {
      name: '',
      description: '',
      cover: {},
      avatar: {},
      coverMessage: '',
      avatarMessage: '',
      timezone: '',
      locale: ''
    }
  },
  computed: {
    submitData() {
      return {
        name: this.name,
        content: {
          text: this.description
        },
        timezone: this.timezone,
        locale: this.locale
      }
    }
  },
  async mounted() {
    const account = this.account
    this.name = account.name
    this.description = account.content.markdown_text
    this.cover = account.content.cover_image
    this.avatar = account.content.avatar_image
    this.timezone = account.timezone
    this.locale = account.locale
  },
  methods: {
    async update() {
      const { meta } = await api().patch('/users/me', this.submitData)
      if (meta.code === 200) {

      }
    },
    changeCover() {
      this.$refs.coverFileInput.click()
    },
    changeAvatar() {
      this.$refs.avatarFileInput.click()
    }
    // avatarChanged(e) {
    //   if(!e.target.files.length) return
    //   const [file] = e.target.files
    //   const fr = new FileReader()
    //   console.log(file)
    //   const over2mb = file.size > 2048000
    //   if(over2mb) {
    //     this.coverMessage = 'Over 1MB.'
    //     return
    //   }
    //     const fd = new FormData()
    //     fd.append('avatar', file)
    //     axios.post('/proxy/users/me/avatar', {
    //         Avatar: file
    //       }, {
    //       headers: {
    //         // 'Content-Type': 'multipart/form-data',
    //         'Content-Length': file.size
    //       }
    //     })
    //     .then(console.log)
    //     .catch(console.error.bind(console))
    // },
    // coverChanged(e) {
    //   if(!e.target.files.length) return
    //   const [file] = e.target.files
    //   const fr = new FileReader()
    //   console.log(file)
    //   const over4mb = file.size > 4096000
    //   if(over4mb) {
    //     this.coverMessage = 'Over 4MB.'
    //     return
    //   }
    //   fr.addEventListener('load', this.loadImage({
    //     viewport: {
    //       width: 300,
    //       height: 300
    //     },
    //     showZoomer: false
    //   }))
    //   fr.readAsDataURL(file)
    //     const fd = new FormData()
    //     fd.append('Avatar', file)
    //     axios.post('/proxy/users/me/cover', fd, {
    //       headers: {
    //         // 'Content-Type': 'multipart/form-data',
    //       }
    //     })
    //     .then(console.log)
    //     .catch(console.error.bind(console))
    // },
    // loadImage(option) {
    //   return async e => {
    //     const { result: base64img } = e.target
    //     const img = new Image()
    //     img.src = base64img
    //     await new Promise(resolve => {
    //       img.addEventListener('load', resolve)
    //     })

    //     const width = 300 || window.innerWidth * 0.8
    //     const height = 300 || window.innerHeight * 0.8
    //     console.log(width, height)
    //     console.log(width, height, img)
    //     // Object.assign(option, {
    //     //   boundary: {
    //     //     width, height
    //     //   }
    //     // })
    //     this.$refs.cropModal.open(base64img, option).result('blob').then(blob => {
    //       console.log(blob)
    //     })
    //   }
    // }
  },
  components: {
    SubmitButton
    // CropModal
  }
}
</script>
