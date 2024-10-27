<template>
  <div class="mx-4 d-flex justify-center align-center" style="height: 50vh">
    <div>
      <p class="text-center">판교고 동아리 발표회</p>
      <v-autocomplete
        :items="items"
        density="comfortable"
        menu-icon=""
        placeholder="이름으로 검색하기"
        prepend-inner-icon="mdi-magnify"
        style="width: calc(100vw - 100px); margin-top: 10px"
        theme="light"
        variant="outlined"
        auto-select-first
        item-props
        rounded
        no-data-text="검색 결과가 없습니다."
      ></v-autocomplete>
    </div>
  </div>
</template>

<script setup>
const items = [
  {
    title: "CZV",
    to: "/survey/club/?clubname=CZV",
  },
  {
    title: "글빛누리",
    to: "/survey/club/?clubname=글빛누리",
  },
  {
    title: "뉴런",
    to: "/survey/club/?clubname=뉴런",
  },
  {
    title: "다이나믹스",
    to: "/survey/club/?clubname=다이나믹스",
  },
  {
    title: "레브",
    to: "/survey/club/?clubname=레브",
  },
  {
    title: "렙토피아",
    to: "/survey/club/?clubname=렙토피아",
  },
  {
    title: "머큐리",
    to: "/survey/club/?clubname=머큐리",
  },
  {
    title: "바이오메드",
    to: "/survey/club/?clubname=바이오메드",
  },
  {
    title: "방송부",
    to: "/survey/club/?clubname=방송부",
  },
  {
    title: "배구사랑",
    to: "/survey/club/?clubname=배구사랑",
  },
  {
    title: "블레마",
    to: "/survey/club/?clubname=블레마",
  },
  {
    title: "스마트 스포츠",
    to: "/survey/club/?clubname=스마트 스포츠",
  },
  {
    title: "시사패치",
    to: "/survey/club/?clubname=시사패치",
  },
  {
    title: "심장박동",
    to: "/survey/club/?clubname=심장박동",
  },
  {
    title: "알뜰리에",
    to: "/survey/club/?clubname=알뜰리에",
  },
  {
    title: "아트 캔버스",
    to: "/survey/club/?clubname=아트 캔버스",
  },
  {
    title: "업템포",
    to: "/survey/club/?clubname=업템포",
  },
  {
    title: "영화를 적시다",
    to: "/survey/club/?clubname=영화를 적시다",
  },
  {
    title: "요리풍 조리풍",
    to: "/survey/club/?clubname=요리풍 조리풍",
  },
  {
    title: "잭팟",
    to: "/survey/club/?clubname=잭팟",
  },
  {
    title: "케미스트",
    to: "/survey/club/?clubname=케미스트",
  },
  {
    title: "코딩인싸이트",
    to: "/survey/club/?clubname=코딩인싸이트",
  },
  {
    title: "티치스트",
    to: "/survey/club/?clubname=티치스트",
  },
  {
    title: "프로그래밍",
    to: "/survey/club/?clubname=프로그래밍",
  },
  {
    title: "프리스타일",
    to: "/survey/club/?clubname=프리스타일",
  },
];
</script>

<style scoped></style>
