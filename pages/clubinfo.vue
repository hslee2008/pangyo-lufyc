<template>
  <div class="mx-4">
    <br />

    <div
      v-if="
        clubInfo.leader.replaceAll(' ', '') === account.displayName ||
        clubInfo.coleader.replaceAll(' ', '') === account.displayName
      "
      class="mb-8 py-4 rounded-lg"
      style="border: 1px solid black"
    >
      <h2 class="text-center mb-4">부장/차장 권한</h2>

      <div class="d-flex justify-center ga-5 mb-3">
        <v-btn
          variant="tonal"
          :to="`/clubadmin/edit/?clubname=${clubName}`"
          class="text-blue"
        >
          정보 편집하기
        </v-btn>
        <v-btn
          variant="tonal"
          :to="`/clubadmin/status/?clubname=${clubName}`"
          class="text-blue"
        >
          신청자 확인하기
        </v-btn>
      </div>
      <div class="d-flex justify-center ga-5 mb-3">
        <v-btn
          variant="tonal"
          :to="`/clubadmin/message/?clubname=${clubName}`"
          class="text-blue"
        >
          문의 확인하기
        </v-btn>
        <v-btn
          variant="tonal"
          :to="`/clubadmin/notification/?clubname=${clubName}`"
          class="text-blue"
        >
          공지사항 등록하기
        </v-btn>
      </div>
      <div class="d-flex justify-center ga-5">
        <v-btn
          v-if="!clubInfo.finished"
          variant="tonal"
          color="red"
          @click="end"
        >
          수동 마감하기
        </v-btn>
        <v-btn v-else variant="tonal" color="red" @click="undoEnd">
          마감 풀기
        </v-btn>
      </div>
    </div>

    <v-layout-item model-value position="bottom" class="text-end" size="88">
      <div class="ma-4">
        <v-dialog max-width="300">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              icon="mdi-message"
              size="large"
              color="primary"
              elevation="8"
            />
          </template>

          <template v-slot:default="{ isActive }">
            <v-card title="문의하기">
              <v-card-text>
                <v-text-field
                  v-model="question"
                  variant="outlined"
                  placeholder="예) 생기부 잘 써주나요?"
                  append-inner-icon="mdi-send"
                  @click:appendInner="send"
                ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="닫기" @click="isActive.value = false"></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </div>
    </v-layout-item>

    <div class="pa-4 rounded-lg d-flex justify-center">
      <img
        :src="
          clubInfo.image ??
          'https://firebasestorage.googleapis.com/v0/b/thinkforall-linkall.appspot.com/o/school%2FPGHS.png?alt=media&token=1a077cc3-d8f0-4994-8d62-09d68ef49739'
        "
        draggable="false"
        height="100px"
        class="rounded-lg"
      />
    </div>

    <h1 class="text-center">{{ clubName }}</h1>
    <h3 class="text-center">
      {{ clubInfo.leader }} /
      {{ clubInfo.coleader }}
    </h3>

    <br />

    <div>
      <p>{{ clubInfo.description }}</p>
    </div>

    <br />

    <v-alert v-if="Object.keys(clubInfo ?? {}).length <= 3">
      아직까지 동아리 부장 또는 차장이 동아리 정보를 설정을 하지 않았기 때문에
      볼 수 없습니다.
    </v-alert>
    <div v-else>
      <v-table style="border: 1px solid black" class="rounded-lg">
        <thead>
          <tr style="background-color: skyblue">
            <th class="text-left">카테고리</th>
            <th class="text-left">정보</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>관련 학과</td>
            <td>
              <v-chip v-for="major in clubInfo.major" size="small">
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
            <td>{{ clubInfo.how }}</td>
          </tr>
          <tr>
            <td>모집 시기</td>
            <td>{{ clubInfo.start }} ~ {{ clubInfo.end }}</td>
          </tr>
        </tbody>
      </v-table>

      <br /><br />

      <v-img :src="clubInfo.poster" class="rounded-lg mx-10 elevation-10"  />
      <div class="d-flex justify-center mt-3">
        <v-btn variant="tonal" class="mt-3" download :href="clubInfo.poster">
          <v-icon start>mdi-download</v-icon> 다운로드 받기
        </v-btn>
      </div>

      <br /><br />

      <h2>경쟁률 확인하기</h2>
      <br />
      <v-table style="border: 1px solid black" class="rounded-lg">
        <thead>
          <tr style="background-color: skyblue">
            <th class="text-left">카테고리</th>
            <th class="text-left">정보</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>최대 모집 인원 수</td>
            <td>{{ clubInfo.memberNumber }}</td>
          </tr>
          <tr>
            <td>남은 인원 수</td>
            <td>
              {{
                clubInfo.memberNumber -
                Object.keys(clubInfo.accepted ?? {}).length
              }}
            </td>
          </tr>
          <tr style="box-shadow: 0 -1px 0 #000">
            <td>전체 경쟁률</td>
            <td
              v-if="
                Object.keys(clubInfo.joining ?? {}).length /
                  (clubInfo.memberNumber -
                    Object.keys(clubInfo.accepted ?? {}).length) <
                1
              "
            >
              100% 합격
            </td>
            <td v-else>
              {{
                Object.keys(clubInfo.joining ?? {}).length /
                (clubInfo.memberNumber -
                  Object.keys(clubInfo.accepted ?? {}).length)
              }}
              대 1
            </td>
          </tr>
          <tr style="box-shadow: 0 -1px 0 #000">
            <td>현재 총 지원자 수</td>
            <td>{{ Object.keys(clubInfo.joining ?? {}).length }}</td>
          </tr>
          <tr>
            <td>현재 1학년 지원자 수</td>
            <td>
              {{
                Object.keys(clubInfo.joining ?? {}).filter((a) =>
                  a.startsWith("1")
                ).length
              }}
            </td>
          </tr>
          <tr>
            <td>현재 2학년 지원자 수</td>
            <td>
              {{
                Object.keys(clubInfo.joining ?? {}).filter((a) =>
                  a.startsWith("2")
                ).length
              }}
            </td>
          </tr>
          <tr style="box-shadow: 0 -1px 0 #000">
            <td>현재 총 합격자 수</td>
            <td>{{ Object.keys(clubInfo.accepted ?? {}).length }}</td>
          </tr>
          <tr>
            <td>현재 1학년 합격자 수</td>
            <td>
              {{
                Object.keys(clubInfo.accepted ?? {}).filter((a) =>
                  a.startsWith("1")
                ).length
              }}
            </td>
          </tr>
          <tr>
            <td>현재 2학년 합격자 수</td>
            <td>
              {{
                Object.keys(clubInfo.accepted ?? {}).filter((a) =>
                  a.startsWith("2")
                ).length
              }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div v-if="typeofAccount !== 'teacher'">
      <br /><br />

      <div>
        <h2>신청하기</h2>
        <br />

        <v-alert v-if="isClubJoiningFinished" color="red">
          모집 기간이 자났습니다.
        </v-alert>
        <v-alert
          v-else-if="
            alreadyJoined &&
            !Object.keys(clubInfo.joining ?? {}).includes(
              account.displayName
            ) &&
            !Object.keys(clubInfo.accepted ?? {}).includes(account.displayName)
          "
        >
          이미 다른 동아리에 가입했습니다.
        </v-alert>

        <v-alert
          v-else-if="
            Object.keys(clubInfo.joining ?? {}).includes(account.displayName)
          "
        >
          신청이 되었습니다.
        </v-alert>
        <v-alert
          v-else-if="
            Object.keys(clubInfo.accepted ?? {}).includes(account.displayName)
          "
        >
          동아리에 합격했습니다.
        </v-alert>
        <v-alert v-else-if="clubInfo.finished" color="red">
          동아리가 수동으로 마감이 되었습니다.
        </v-alert>
        <div v-else>
          <v-text-field
            v-model="joining.name"
            variant="outlined"
            disabled
            label="학번과 이름"
          ></v-text-field>
          <v-text-field
            v-model="joining.email"
            variant="outlined"
            disabled
            label="학교 이메일"
          ></v-text-field>
          <v-text-field
            v-model="joining.phone"
            variant="outlined"
            label="전화번호"
          ></v-text-field>
          <v-textarea
            v-if="clubInfo.getWhyJoined"
            v-model="joining.whyJoined"
            variant="outlined"
            placeholder="자기소개 부분 (필수)"
          ></v-textarea>

          <v-btn
            block
            variant="tonal"
            color="yellow-darken-4"
            @click="join"
            :disabled="
              !joining.phone ||
              (clubInfo.getWhyJoined ? !joining.whyJoined : false)
            "
          >
            신청하기
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";

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
</script>
