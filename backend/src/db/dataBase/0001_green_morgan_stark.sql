CREATE TABLE `refreshToken` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_in` integer NOT NULL,
	`revoked` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refreshToken_id_unique` ON `refreshToken` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `refreshToken_token_unique` ON `refreshToken` (`token`);--> statement-breakpoint
ALTER TABLE `courses` ADD `language` text DEFAULT 'Python' NOT NULL;