alter table tasks
  add column priority text not null default 'medium'
    check (priority in ('high', 'medium', 'low'));

create index if not exists tasks_due_date_idx on tasks (due_date);
