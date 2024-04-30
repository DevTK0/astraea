alter table "public"."server_configs" drop constraint "server_configs_server_id_key";

alter table "public"."users" drop constraint "users_user_id_key";

alter table "public"."server_configs" drop constraint "server_configs_pkey";

drop index if exists "public"."server_configs_server_id_key";

drop index if exists "public"."users_user_id_key";

drop index if exists "public"."server_configs_pkey";

alter table "public"."server_configs" drop column "instance_type";

alter table "public"."server_configs" drop column "volume_size";

alter table "public"."server_configs" add column "config" text not null default 'Config'::text;

alter table "public"."server_configs" add column "value" text;

alter table "public"."users" drop column "user_id";

drop sequence if exists "public"."users_user_id_seq";

CREATE UNIQUE INDEX server_configs_pkey ON public.server_configs USING btree (server_id, config);

alter table "public"."server_configs" add constraint "server_configs_pkey" PRIMARY KEY using index "server_configs_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (auth_uid)
  values (new.id);
  return new;
end;
$function$
;


