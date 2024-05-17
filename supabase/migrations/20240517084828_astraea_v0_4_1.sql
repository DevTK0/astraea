create table "public"."site_configs" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "config" text not null,
    "value" text
);


alter table "public"."site_configs" enable row level security;

CREATE UNIQUE INDEX site_configs_config_key ON public.site_configs USING btree (config);

CREATE UNIQUE INDEX site_configs_pkey ON public.site_configs USING btree (id);

alter table "public"."site_configs" add constraint "site_configs_pkey" PRIMARY KEY using index "site_configs_pkey";

alter table "public"."site_configs" add constraint "site_configs_config_key" UNIQUE using index "site_configs_config_key";

grant delete on table "public"."site_configs" to "anon";

grant insert on table "public"."site_configs" to "anon";

grant references on table "public"."site_configs" to "anon";

grant select on table "public"."site_configs" to "anon";

grant trigger on table "public"."site_configs" to "anon";

grant truncate on table "public"."site_configs" to "anon";

grant update on table "public"."site_configs" to "anon";

grant delete on table "public"."site_configs" to "authenticated";

grant insert on table "public"."site_configs" to "authenticated";

grant references on table "public"."site_configs" to "authenticated";

grant select on table "public"."site_configs" to "authenticated";

grant trigger on table "public"."site_configs" to "authenticated";

grant truncate on table "public"."site_configs" to "authenticated";

grant update on table "public"."site_configs" to "authenticated";

grant delete on table "public"."site_configs" to "service_role";

grant insert on table "public"."site_configs" to "service_role";

grant references on table "public"."site_configs" to "service_role";

grant select on table "public"."site_configs" to "service_role";

grant trigger on table "public"."site_configs" to "service_role";

grant truncate on table "public"."site_configs" to "service_role";

grant update on table "public"."site_configs" to "service_role";

create policy "users can read configs"
on "public"."site_configs"
as permissive
for select
to public
using (true);



