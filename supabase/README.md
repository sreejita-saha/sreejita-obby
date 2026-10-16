# Secure ratings deployment

The rating widget no longer writes to `public.ratings` from the browser. It
calls the `submit-rating` Edge Function, which validates the payload and uses
the service-role key only on the server.

Deploy the migration and function from a Supabase CLI session linked to this
project:

```powershell
supabase db push
supabase functions deploy submit-rating
```

Set these Edge Function secrets before deploying (do not put either value in
`.env.local` or any `VITE_` variable):

```powershell
supabase secrets set RATING_ALLOWED_ORIGIN=https://your-site.example
supabase secrets set RATING_FINGERPRINT_SALT=<a-long-random-secret>
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are supplied to hosted Edge
Functions by Supabase. `RATING_ALLOWED_ORIGIN` must be the exact deployed site
origin, without a trailing slash. Add a separate value when using a preview or
local deployment.

The migration enables RLS and removes all `anon`/`authenticated` access to
ratings. Do not create a public select policy for this table. If feedback is
later shown in an admin UI, render comments as text (`textContent` or normal
React interpolation), never with `dangerouslySetInnerHTML`.
