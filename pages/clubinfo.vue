<template>
  <div class="mx-10" style="width: 95%">
    <div class="pa-4 rounded-lg d-flex justify-center">
      <img
        :src="clubInfo.image ?? '/PGHS.png'"
        draggable="false"
        height="100px"
        class="rounded-lg"
      />
    </div>

    <div class="d-flex justify-center">
      <h1 class="text-center">{{ clubName }}</h1>
      <v-btn variant="icon" :to="`/clubadmin/edit/?clubname=${clubName}`"
        ><v-icon>mdi-pencil</v-icon> 수정</v-btn
      >
    </div>

    <br />

    <div>
      <p>{{ clubInfo.description }}</p>
    </div>

    <br />

    <v-alert v-if="!clubInfo.finished" color="#86CFEB">
      동아리 신청 가능
    </v-alert>
    <v-alert v-else color="red"> 동아리 신청 마감 </v-alert>

    <br />

    <v-alert v-if="Object.keys(clubInfo ?? {}).length <= 3">
      <v-empty-state
        icon="mdi-information-off"
        text="아직까지 동아리 부장 또는 차장이 동아리 정보를 설정을 하지 않았기 때문에 볼 수 없습니다."
        title="동아리 정보 부족"
      ></v-empty-state>
    </v-alert>
    <div v-else>
      <v-table style="border: 1px solid black" class="rounded-lg">
        <thead>
          <tr style="background-color: skyblue">
            <th class="text-left" style="min-width: 100px">카테고리</th>
            <th class="text-left">정보</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>관련 학과</td>
            <td class="py-2">
              <v-chip v-for="major in clubInfo.major" size="small" class="ma-1">
                {{ major }}
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>최대 모집 인원 수</td>
            <td>{{ clubInfo.memberNumber }}</td>
          </tr>
          <tr>
            <td>모집 방법</td>
            <td>
              {{ clubInfo.how }}
              <v-chip
                v-if="clubInfo.how === '자기소개서' && !clubInfo.howmessage?.includes('구글폼')"
                color="primary"
                size="small"
                class="ml-2"
                @click="downloadURI('/동아리자기소개서.hwp', '자기소개서.hwp')"
              >
                양식 다운로드
              </v-chip>
              <p v-if="clubInfo.howmessage?.includes('카카오톡') && clubInfo.how === '자기소개서'" style="color: red;">* 카톡으로 보내주세요</p>
            </td>
          </tr>
          <tr>
            <td>지원 방법</td>
            <td>
              <v-chip
                v-for="major in clubInfo.howmessage"
                size="small"
                class="ma-1"
              >
                <a
                  v-if="major === '구글폼'"
                  :href="clubInfo.formlink"
                  target="_blank"
                >
                  구글폼 (링크)
                </a>
                <a v-else-if="major === '인스타'">
                  인스타
                  <a
                    v-for="(i, ind) in parse(clubInfo.insta).split(' ')"
                    :href="i"
                    :key="i"
                    >{{ clubInfo.insta.split(" ")[ind] }}<span v-if="ind !== parse(clubInfo.insta).split(' ').length - 1">,</span>
                  </a>
                </a>
                <span v-else
                  >{{ major }} (
                  {{
                    major === "문자" || major === "카카오톡"
                      ? clubInfo.phone
                      : major === "인스타"
                      ? clubInfo.insta
                      : ""
                  }}
                  )</span
                >
              </v-chip>
            </td>
          </tr>
          <tr>
            <td>모집 시기</td>
            <td>{{ clubInfo.start }} ~ {{ clubInfo.end }}</td>
          </tr>
        </tbody>
      </v-table>

      <br /><br />

      <div v-if="clubInfo.poster" class="d-flex justify-center">
        <div>
          <v-img
            :src="clubInfo.poster"
            class="rounded-lg mx-10 elevation-10"
            style="min-width: 300px"
          />
          <div class="d-flex justify-center mt-3">
            <v-btn
              variant="tonal"
              class="mt-3"
              download
              :href="downloadImage(clubInfo.poster)"
            >
              <v-icon start>mdi-download</v-icon> 다운로드
            </v-btn>
          </div>
        </div>
      </div>

      <br /><br />

      <v-card v-if="Object.keys(clubInfo).length > 3" elevation="0">
        <v-card-title class="text-center mt-2">문의하기</v-card-title>
        <v-card-text>
          <v-textarea
            :disabled="!account?.displayName"
            v-model="question"
            variant="outlined"
            placeholder="생기부 잘 써주나요?"
            append-inner-icon="mdi-send"
            @click:appendInner="send"
          ></v-textarea>
          <div v-if="!account?.displayName">
            문의하기는 판교고 계정으로 로그인 후 가능합니다.
          </div>
          <v-btn
            @click="login"
            v-if="!account?.displayName"
            variant="outlined"
            class="mt-3"
          >
            로그인
          </v-btn>
        </v-card-text>
      </v-card>

      <br /><br />

      <div>
        <div
          v-for="m in Object.keys(clubInfo.message ?? {})"
          :key="m"
          class="mb-3"
        >
          <v-card variant="outlined">
            <v-card-title>
              <b>{{ m }}</b>
            </v-card-title>
            <v-card-text>
              <v-list v-for="i in clubInfo.message[m]">
                <span v-if="i.includes('ans:')">
                  <v-list-item-title>
                    <v-chip color="primary" class="ma-1">
                      {{ i.replace("ans:", "") }}
                    </v-chip>
                  </v-list-item-title>
                </span>
                <span v-else>
                  <v-list-item-title>{{ i }}</v-list-item-title>
                </span>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const clubInfo = ref({
  leader: "",
  coleader: "",
});
const joining = ref({
  name: "",
  email: "",
});
const account = ref({});
const alreadyJoined = ref("");
const question = ref("");
const typeofAccount = ref("");
const isClubJoiningFinished = ref(false);

const { $auth, $db } = useNuxtApp();
const route = useRoute();
const clubName = route.query.clubname;

function join() {
  const clubRef = dbRef(
    $db,
    `clubs/${clubName}/joining/${account.value.displayName}`
  );
  set(clubRef, joining.value);

  const accountRef = dbRef($db, `member/${account.value.displayName}/joined`);
  set(accountRef, true);

  const notifRef = dbRef(
    $db,
    `member/${account.value.displayName}/notification`
  );
  push(notifRef, {
    message: `${clubName} 동아리에 지원했습니다. 동아리 합격 또는 불합격의 여부는 동아리 부장이 결정한 후 알림을 줍니다.`,
  });
}

function send() {
  const messageRef = dbRef(
    $db,
    `clubs/${clubName}/message/${account.value.displayName}`
  );
  push(messageRef, question.value);
  question.value = "";
}

function cancelClub(isActive) {
  const clubRef = dbRef(
    $db,
    `clubs/${clubName}/joining/${account.value.displayName}`
  );
  set(clubRef, null);

  const accountRef = dbRef($db, `member/${account.value.displayName}/joined`);
  set(accountRef, null);

  const notifRef = dbRef(
    $db,
    `member/${account.value.displayName}/notification`
  );
  push(notifRef, {
    message: `${clubName} 동아리 지원을 취소했습니다.`,
  });

  isActive.value = false;
}

onMounted(async () => {
  const clubRef = dbRef($db, `clubs/${clubName}`);
  await onValue(clubRef, (snapshot) => (clubInfo.value = snapshot.val()));

  onAuthStateChanged($auth, (user) => {
    account.value = user;
    joining.value.name = user.displayName;
    joining.value.email = user.email;
    joining.value.photoURL = user.photoURL;

    onValue(
      dbRef($db, `member/${account.value.displayName}/joined`),
      (snapshot) => {
        alreadyJoined.value = snapshot.val();
      }
    );

    onValue(
      dbRef($db, `everyone/${account.value.displayName}/type`),
      (snapshot) => {
        typeofAccount.value = snapshot.val();
      }
    );
  });

  const today = new Date();
  const endDate = new Date(clubInfo.value.end);
  endDate.setDate(endDate.getDate() + 1);

  isClubJoiningFinished.value = today > endDate;
});

function end() {
  clubInfo.value.finished = true;
  const messageRef = dbRef($db, `clubs/${clubName}`);
  set(messageRef, clubInfo.value);
}

function undoEnd() {
  clubInfo.value.finished = false;
  const messageRef = dbRef($db, `clubs/${clubName}`);
  set(messageRef, clubInfo.value);
}

const login = async () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup($auth, provider).then(() =>
    onAuthStateChanged($auth, async (user) => {
      account.value = user;
    })
  );
};

async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "image file name here";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function parse(text) {
  const regex = /@(\S+)/g; // Regex to match Instagram-style handles
  let matches = text.match(regex); // Find all matches

  if (matches) {
    return matches
      .map((username) => {
        let cleanUsername = username.replace("@", ""); // Remove '@' from the username
        return `https://instagram.com/${cleanUsername}`;
      })
      .join(" "); // Join links with spaces
  }

  return text; // Return original text if no matches found
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name; // <- name instead of 'name'
  link.href = uri;
  link.click();
  link.remove();
}
</script>
