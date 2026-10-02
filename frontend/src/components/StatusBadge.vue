<script setup>
defineProps({
  status: { type: String, required: true },
});

const LABELS = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  ON_HOLD: 'On Hold',
  COMPLETE: 'Complete',
  PLANNING: 'Planning',
  EXECUTION: 'Execution',
  COMPLETED: 'Completed',
  DRAFT: 'Draft',
  ISSUED: 'Issued',
  RECEIVED: 'Received',
  CANCELLED: 'Cancelled',
  TODO: 'To Do',
  DOING: 'Doing',
  DONE: 'Done',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};
</script>

<template>
  <span class="badge" :class="`badge--${status.toLowerCase()}`">
    {{ LABELS[status] ?? status }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: var(--font-sm);
  color: #fff;
  background: var(--color-text-muted);
}

.badge--open,
.badge--planning,
.badge--draft,
.badge--todo,
.badge--low {
  background: var(--status-open);
}

.badge--in_progress,
.badge--execution,
.badge--issued,
.badge--doing,
.badge--medium {
  background: var(--status-in-progress);
}

.badge--on_hold,
.badge--cancelled,
.badge--high {
  background: var(--status-on-hold);
}

.badge--complete,
.badge--completed,
.badge--received,
.badge--done {
  background: var(--status-complete);
}
</style>