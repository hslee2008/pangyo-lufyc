<template>
  <div style="width: 95%">
    <h1 class="text-center">계정 정보</h1>

    <br />

    <v-table>
      <thead>
        <tr>
          <th class="text-left">카테고리</th>
          <th class="text-left">정보</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>계정 정보</td>
          <td>
            {{ type }}
          </td>
        </tr>
        <tr>
          <td>학번</td>
          <td>
            {{ getInfoFromName(account?.displayName).number }}
          </td>
        </tr>
        <tr>
          <td>이름</td>
          <td>
            {{ getInfoFromName(account?.displayName).name }}
          </td>
        </tr>
      </tbody>
    </v-table>

    <br /><br />

    <h2>알림</h2>
    <v-list bg-color="grey-lighten-3">
      <v-list-item v-for="(notif, i) in notification" :key="i">
        <v-list-item-title>{{ notif.message }}</v-list-item-title>
        <v-btn
          @click="deleteNotification(i)"
          block
          variant="tonal"
          class="mt-2"
        >
          <v-icon start>mdi-trash-can</v-icon> 지우기
        </v-btn>
      </v-list-item>
    </v-list>

    <br />
    <br />
    <br />
    <br />

    <v-btn color="red" block @click="logout"> 로그아웃 </v-btn>
  </div>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";

const { $auth, $db } = useNuxtApp();

const router = useRouter();

const account = ref({});
const type = ref("");
const notification = ref({});

const logout = () => {
  router.push("/");
  $auth.signOut();
};

function deleteNotification(i) {
  const notifRef = dbRef(
    $db,
    `/member/${account.value.displayName}/notification/${i}`
  );
  set(notifRef, null);
}

onMounted(() => {
  onAuthStateChanged($auth, (user) => {
    account.value = user;

    if (user) {
      const userDB = dbRef($db, `/everyone/${user.displayName}/type`);
      onValue(userDB, (snapshot) => {
        const data = snapshot.val();
        type.value = data;
      });

      const accountDB = dbRef($db, `/member/${user.displayName}/notification`);
      onValue(accountDB, (snapshot) => {
        const data = snapshot.val();
        notification.value = data;
      });
    }
  });
});
</script>
