drop policy "users can join servers" on "public"."server_communities";

drop policy "users can retrieve  ip_address" on "public"."users";

drop policy "users can update their own ip_address" on "public"."users";

alter table "public"."server_communities" drop constraint "server_communities_user_id_fkey";

alter table "public"."server_communities" drop constraint "server_community_pkey";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."server_community_pkey";

drop index if exists "public"."users_pkey";

create table "public"."server_configs" (
    "server_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "volume_size" smallint not null default '8'::smallint,
    "instance_type" text not null default 't2.small'::text
);


alter table "public"."server_configs" enable row level security;

alter table "public"."server_communities" rename column "sav_filename" to "save_id";

alter table "public"."server_communities" rename column "user_id" to "auth_uid";

-- alter table "public"."server_communities" add column "auth_uid" uuid not null;

-- alter table "public"."server_communities" add column "save_id" text;

alter table "public"."servers" add column "server_name" text not null default 'Server'::text;

alter table "public"."users" rename column "user_id" to "auth_uid";

alter table "public"."users" add column "user_id" serial not null;

ALTER TABLE "public"."users" ALTER COLUMN "user_id" drop default;

alter table "public"."users" alter column "user_id" add generated by default as identity;

-- alter table "public"."users" alter column "user_id" set data type bigint using "user_id"::bigint;

CREATE UNIQUE INDEX server_configs_pkey ON public.server_configs USING btree (server_id);

CREATE UNIQUE INDEX server_configs_server_id_key ON public.server_configs USING btree (server_id);

CREATE UNIQUE INDEX users_auth_uid_key ON public.users USING btree (auth_uid);

CREATE UNIQUE INDEX users_user_id_key ON public.users USING btree (user_id);

CREATE UNIQUE INDEX server_community_pkey ON public.server_communities USING btree (server_id, auth_uid);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (auth_uid);

alter table "public"."server_configs" add constraint "server_configs_pkey" PRIMARY KEY using index "server_configs_pkey";

alter table "public"."server_communities" add constraint "server_community_pkey" PRIMARY KEY using index "server_community_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."server_communities" add constraint "server_communities_auth_uid_fkey" FOREIGN KEY (auth_uid) REFERENCES users(auth_uid) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."server_communities" validate constraint "server_communities_auth_uid_fkey";

alter table "public"."server_configs" add constraint "server_configs_server_id_fkey" FOREIGN KEY (server_id) REFERENCES servers(server_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."server_configs" validate constraint "server_configs_server_id_fkey";

alter table "public"."server_configs" add constraint "server_configs_server_id_key" UNIQUE using index "server_configs_server_id_key";

alter table "public"."users" add constraint "users_auth_uid_fkey" FOREIGN KEY (auth_uid) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_auth_uid_fkey";

alter table "public"."users" add constraint "users_auth_uid_key" UNIQUE using index "users_auth_uid_key";

alter table "public"."users" add constraint "users_user_id_key" UNIQUE using index "users_user_id_key";

grant delete on table "public"."server_configs" to "anon";

grant insert on table "public"."server_configs" to "anon";

grant references on table "public"."server_configs" to "anon";

grant select on table "public"."server_configs" to "anon";

grant trigger on table "public"."server_configs" to "anon";

grant truncate on table "public"."server_configs" to "anon";

grant update on table "public"."server_configs" to "anon";

grant delete on table "public"."server_configs" to "authenticated";

grant insert on table "public"."server_configs" to "authenticated";

grant references on table "public"."server_configs" to "authenticated";

grant select on table "public"."server_configs" to "authenticated";

grant trigger on table "public"."server_configs" to "authenticated";

grant truncate on table "public"."server_configs" to "authenticated";

grant update on table "public"."server_configs" to "authenticated";

grant delete on table "public"."server_configs" to "service_role";

grant insert on table "public"."server_configs" to "service_role";

grant references on table "public"."server_configs" to "service_role";

grant select on table "public"."server_configs" to "service_role";

grant trigger on table "public"."server_configs" to "service_role";

grant truncate on table "public"."server_configs" to "service_role";

grant update on table "public"."server_configs" to "service_role";

create policy "users can see everyone's communities"
on "public"."server_communities"
as permissive
for select
to authenticated
using (true);


create policy "users can retrieve server_configs"
on "public"."server_configs"
as permissive
for select
to authenticated
using (true);


create policy "users can retrieve server_configs"
on "public"."servers"
as permissive
for select
to authenticated
using (true);


create policy "users can see everyone's profiles"
on "public"."users"
as permissive
for select
to authenticated
using (true);


create policy "users can update their own data"
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = auth_uid))
with check ((auth.uid() = auth_uid));



