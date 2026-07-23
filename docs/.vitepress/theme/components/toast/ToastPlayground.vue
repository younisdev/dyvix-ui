<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ToastPlayground from './ToastPlayground';

const container = ref(null);
let root;

onMounted(() => {
  root = ReactDOM.createRoot(container.value);
  root.render(React.createElement(ToastPlayground));
});

onUnmounted(() => root?.unmount());
</script>

<template>
  <div ref="container"></div>
</template>
