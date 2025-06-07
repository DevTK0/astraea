INSERT INTO "public"."games" ("game_id", "name", "created_at") VALUES
	(3, 'Core Keeper', '2025-06-07 04:23:23.601081+00');

INSERT INTO "public"."servers" ("server_id", "created_at", "description", "game_id", "server_name") VALUES
	(3, '2025-06-07 04:24:23.930894+00', 'Astraea server for Core Keeper.', 3, 'Astraea Core Keeper Server');


INSERT INTO "public"."server_configs" ("server_id", "created_at", "config", "value") VALUES
    (3, '2025-06-07 04:31:40.558948+00', 'game_configs', '{}'),
	(3, '2025-06-07 04:32:12.860244+00', 'instance_type', 'r5a.large'),
	(3, '2025-06-07 04:35:31.15051+00', 'security_group', 'sg-05ffdab4da44a1a82'),
	(3, '2025-06-07 04:36:26.30071+00', 'volume_size', '8'),
	(3, '2025-06-07 04:36:47.158001+00', 'weekday_access', 'false');