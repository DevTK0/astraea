create policy "users can join servers"
on "public"."server_communities"
as permissive
for insert
to authenticated
with check (true);


create policy "users can update their server membership"
on "public"."server_communities"
as permissive
for update
to public
using (true)
with check (true);


create policy "users can update game_configs"
on "public"."server_configs"
as permissive
for update
to authenticated
using (true);



