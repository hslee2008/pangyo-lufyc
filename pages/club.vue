<template>
  <div>
    <br />

    <h1 class="text-center">동아리</h1>

    <br />

    <v-radio-group v-model="std">
      <v-radio value="popular" label="지원자 수 많은 동아리"></v-radio>
      <v-radio value="lesscompetitive" label="경쟁률 낮은 동아리"></v-radio>
    </v-radio-group>

    <br />

    <v-row class="d-flex mx-1">
      <v-col
        v-for="item in Object.values(list ?? {}).sort((a, b) => {
          if (std === 'popular') {
            return (
              Object.keys(b?.joining ?? {}).length -
              Object.keys(a?.joining ?? {}).length
            );
          } else if (std === 'lesscompetitive') {
            return (
              Object.keys(a?.joining ?? {}).length / a.memberNumber -
              Object.keys(b?.joining ?? {}).length / b.memberNumber
            );
          }
        })"
        :key="item.name"
      >
        <v-card
          :to="`/clubinfo?clubname=${item.name}`"
          width="200"
          elevation="10"
        >
          <v-img
            :src="
              item?.image ??
              'https://firebasestorage.googleapis.com/v0/b/thinkforall-linkall.appspot.com/o/school%2FPGHS.png?alt=media&token=1a077cc3-d8f0-4994-8d62-09d68ef49739'
            "
            class="align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="200px"
            cover
          >
            <v-card-title class="text-white" style="margin-bottom: -10px">
              {{ item.name }}
            </v-card-title>
            <v-card-subtitle class="text-white mb-3">
              {{
                Object.keys(item.joining ?? {}).length /
                (item.memberNumber == undefined
                  ? 20
                  : item.memberNumber - Object.keys(item.accepted ?? {}).length)
              }}
              대 1
            </v-card-subtitle>
          </v-img>

          <v-card-actions>
            부장: {{ item.leader }} <br />
            차장: {{ item.coleader }}
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const list = ref([]);
const std = ref("popular");

onMounted(() => {
  const clubRef = dbRef($db, "clubs");
  onValue(clubRef, (snapshot) => (list.value = snapshot.val()));
});
</script>
