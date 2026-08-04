drop policy if exists "Users can view their own tasks" on tasks;
drop policy if exists "Users can insert their own tasks" on tasks;
drop policy if exists "Users can update their own tasks" on tasks;
drop policy if exists "Users can delete their own tasks" on tasks;

create policy "Authenticated users can view all tasks"
  on tasks for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert tasks"
  on tasks for insert
  with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Authenticated users can update all tasks"
  on tasks for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete all tasks"
  on tasks for delete
  using (auth.role() = 'authenticated');
