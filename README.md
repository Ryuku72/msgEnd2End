![GitHub last commit](https://img.shields.io/github/last-commit/Ryuku72/MessageNovel?style=for-the-badge)
![GitHub commit activity](https://img.shields.io/github/commit-activity/y/Ryuku72/MessageNovel?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/Ryuku72/MessageNovel?style=for-the-badge)

# Welcome to Message Novel

Message Novel an open source Remix React project built with Vite and a Supabase Backend. 
To try out the website please visit [Message Novel](https://messagenovel.vercel.app/) by clicking the link.

## Key concepts

For a user, CRUD your way through making your own novella either by yourself or with collaboration. Built using Lexical JS and utilitzing Liveblocks for collobration, Message Novel should feel inuitive and invite chatter. Whether that be through comments or actual contributions to the story.

As a developer, Message novel is: 

- An Experiment in the limitations of TailwindCSS and Remix Run.
- A full stack set up of a Postgres database that utilizes webhooks to talk to Liveblocks
- Using a blender file with Three JS to show off some Jazzy scenary
- Expression of love for Lexical JS
- Deploy with Vercel CI/CD 

## Limitations of Remix

Remix is a create library alternative to Next.JS especially in terms of Routing through ```<Outlet />```
However, ```loader``` and ```action``` pose some serious limits. The fact that you will need to call a new instance of Supabase within each route leads to unnecessary API calls and worse duplicate data.

Whilst this can be broken down in places, in others its unavoidable.

## Limitations of Tailwind CSS

There is none... its purely a skill issue... Look at Tailwind.css file. That is an illustration of places that I could not get to work. Lexical requires all elements only have 1 className and thus I had to make special conditons to overcome this issue

## Issues with Lexical

Collobration Plugin references documnent and so we have to use a mount hook to avoid it rendering on server. Furthermore, trying to find out a way to convert editorState to yjs update was very painful.

## Limitations with Supabase and Lexical

Currently there is no offical provider for Lexical and Supabase. Whilst I did try to use ```https://github.com/AlexDunmow/y-supabase``` this was very limiting and buggy. In the end I ported all the collobration elements (pages) to Liveblocks.

<br>
<br>
<br>

## Database and Env Setup
You will need to set up 2 different databases (Supabase and Liveblocks). The instructions for adding Supabase tables are below. Once both Supabse and Liveblocks accounts are set up make a new env file in the root directory and add the following keys

-- SUPABASE_URL
-- SUPABASE_KEY
-- SUPABASE_IMG_STORAGE
-- SUPABASE_SERVICE_KEY
-- LIVEBLOCKS_PUBLIC_KEY
-- LIVEBLOCKS_SECRET_KEY

The Supabase Img Storage value is the following 'SUPABASE_URL' + '/storage/v1/object/'

## Supabase Database Setup

To set up tables and storage in Supabase please copy and paste the following commands into the SQL Editor. Please do it in order due to how dropping tables for updates work. 

!! important please enable webhooks before doing any of this.
Also remove email authentication requirements. (Authentication > Providers > Email > Confirm Email: false)

### Public Profile
```sh
DROP TABLE IF EXISTS public.profiles cascade;

CREATE TABLE
  public.profiles (
    id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    email text,
    username text,
    color text,
    avatar text,
    created_at timestamp DEFAULT timezone('UTC', now()),
    updated_at timestamp DEFAULT timezone('UTC', now()),
    PRIMARY KEY (id)
  );

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
alter publication supabase_realtime
add table public.profiles;

CREATE POLICY "Allow select for all profiles" ON public.profiles FOR
SELECT
  USING (true);

CREATE POLICY "Can only update own user data." ON public.profiles
FOR UPDATE
  USING (auth.uid () = id);

CREATE POLICY "Can only delete own user data." ON public.profiles FOR DELETE USING (auth.uid () = id);

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('UTC', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE
OR REPLACE FUNCTION public.create_user () RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.profiles (id, email, username, color, avatar) 
VALUES 
  (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'username', 
    NEW.raw_user_meta_data ->> 'color',
    NEW.raw_user_meta_data ->> 'avatar'
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_user_trigger
AFTER INSERT ON auth.users FOR EACH ROW WHEN (NEW.raw_user_meta_data IS NOT NULL)
EXECUTE FUNCTION public.create_user ();

CREATE
OR REPLACE FUNCTION public.update_users_from_auth () RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET (updated_at, username, color, avatar) = (
    NEW.updated_at,
    NEW.raw_user_meta_data ->> 'username', 
    NEW.raw_user_meta_data ->> 'color',
    NEW.raw_user_meta_data ->> 'avatar'
  )
  WHERE (
    public.profiles.id = NEW.id
  );
  RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER update_user_trigger
AFTER
UPDATE ON auth.users FOR EACH ROW WHEN (
  NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data
)
EXECUTE FUNCTION public.update_users_from_auth ();

CREATE
OR REPLACE trigger "webhook_novel_delete_profile_trigger" after delete on public.profiles for each row
execute function "supabase_functions"."http_request"(
  'https://messagenovel.vercel.app/api/profile/delete',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

```

### Public Novels

```sh
drop table if exists public.novels cascade;

create table
  public.novels (
    id uuid NOT NULL DEFAULT uuid_generate_v4 () unique,
    created_at timestamp default timezone('UTC', now()),
    updated_at timestamp default timezone('UTC', now()),
    owner uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
    title text,
    description jsonb,
    example boolean default false,
    primary key (id)
  );

alter table public.novels enable row level security;
alter publication supabase_realtime
add table public.novels;

CREATE POLICY "Allow select for all novels" ON public.novels FOR
SELECT
  USING (true);

create policy "Can only insert if authenticated." on public.novels for insert to authenticated
with
  check (true);

create policy "Can only update if owner" on public.novels
for update
  to authenticated using (owner = auth.uid ());

create policy "Can only delete if owner" on public.novels for delete using (auth.uid () = owner);

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('UTC', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.novels
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

create
or replace function public.create_first_novel_entry () returns trigger as $$
begin
insert into public.novels (owner, title, description, example) 
VALUES 
  (
    new.id,
    'Example Novel for ' || new.username,
    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"This is an example entry for your library. If you would like to update the description or title then please click the \"Edit Description\" button below. If you would to use this entry to try write a novel then click the \"Write Novel\" button. Lastly, if you would like to delete this entry then please click the red text below marked \"Delete Novel\". I hope you have a whimsical time. ","type":"text","version":1},{"type":"linebreak","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"- Your friend Josh ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    true
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_user_novel_entry_trigger
AFTER INSERT ON public.profiles FOR EACH ROW WHEN (new.id IS NOT NULL)
EXECUTE FUNCTION public.create_first_novel_entry ();

```

### Public Novel Members

```sh
DROP TABLE IF EXISTS public.novel_members cascade;

CREATE TABLE
  public.novel_members (
    user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
    novel_id uuid REFERENCES public.novels (id) ON DELETE CASCADE,
    PRIMARY KEY (novel_id, user_id)
  );

ALTER TABLE public.novel_members ENABLE ROW LEVEL SECURITY;
alter publication supabase_realtime
add table public.novel_members;

create policy "Can only select if authenticated." on public.novel_members for
select
  using (true);

create policy "Can only insert if authenticated." on public.novel_members for insert to authenticated
with
  check (true);

create policy "Can only delete if authenticated" on public.novel_members for DELETE to authenticated using (true);

create policy "Can only update if authenticated" on public.novel_members
for update
  to authenticated using (true);

create
or replace function public.create_first_novel_member () returns trigger as $$
begin
insert into public.novel_members (novel_id, user_id) 
VALUES 
  (
    new.id,
    new.owner
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_user_novel_member_trigger
AFTER INSERT ON public.novels FOR EACH ROW WHEN (
  new.id IS NOT NULL
  and new.owner is not null
)
EXECUTE FUNCTION public.create_first_novel_member ();

```

### Public Pages

```sh
drop table if exists public.pages cascade;

create table
  public.pages (
    id uuid NOT NULL default uuid_generate_v4 () unique,
    created_at timestamp default timezone('UTC', now()),
    updated_at timestamp default timezone('UTC', now()),
    novel_id uuid references public.novels (id) on delete cascade,
    owner uuid references public.profiles (id) on delete cascade,
    reference_title text,
    published jsonb,
    enable_collab boolean default true,
    example boolean default false,
    primary key (id)
  );

alter table public.pages enable row level security;
alter publication supabase_realtime
add table public.pages;

CREATE POLICY "Allow select for all" ON public.pages FOR
SELECT
  USING (true);

create policy "Can only insert if authenticated." on public.pages for insert to authenticated
with
  check (true);

CREATE POLICY "Can only update if owner." ON public.pages
FOR UPDATE
  USING (
    auth.role () = 'authenticated'
    AND owner = auth.uid ()
  );

CREATE POLICY "Owner can delete pages" ON public.pages FOR DELETE USING (auth.uid () = owner);

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('UTC', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

CREATE
OR REPLACE FUNCTION public.create_first_page () RETURNS TRIGGER AS $$ 
BEGIN
  -- Check if example entry
  IF NEW.example = true THEN
    INSERT INTO public.pages (novel_id, owner, reference_title, published, example) 
    VALUES (
      NEW.id,
      NEW.owner,
      'Page 1: Lorem Ipsum',
 '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Lorem Ipsum?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Lorem Ipsum","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":1},{"children":[],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Why do we use it?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where does it come from?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Where can I get some?","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"The rest is up to you...","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
 true
    );
  ELSE
INSERT INTO public.pages (novel_id, owner, reference_title, published) 
VALUES 
  (
    NEW.id,
    NEW.owner,
    'Page one',
    null
  );
 END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE
OR REPLACE TRIGGER create_first_novel_page_trigger
AFTER INSERT ON public.novels FOR EACH ROW WHEN (NEW.title IS NOT NULL)
EXECUTE FUNCTION public.create_first_page ();

CREATE
OR REPLACE trigger "webhook_novel_add_page_trigger" after insert
on public.pages for each row WHEN (NEW.example = true)
execute function supabase_functions.http_request(
  'https://messagenovel.vercel.app/api/novel/insert',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

CREATE
OR REPLACE trigger "webhook_novel_delete_page_trigger" after delete on public.pages for each row
execute function supabase_functions.http_request(
  'https://messagenovel.vercel.app/api/novel/delete',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);

```

### Public Page Members

```sh
DROP TABLE IF EXISTS public.page_members cascade;

CREATE TABLE
  public.page_members (
    user_id uuid REFERENCES public.profiles (id) ON DELETE CASCADE,
    page_id uuid REFERENCES public.pages (id) ON DELETE CASCADE,
    PRIMARY KEY (page_id, user_id)
  );

ALTER TABLE public.page_members ENABLE ROW LEVEL SECURITY;
alter publication supabase_realtime
add table public.page_members;

create
or replace function public.create_first_page_member () returns trigger as $$
begin
insert into public.page_members (page_id, user_id) 
VALUES 
  (
    new.id,
    new.owner
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

create policy "Can only select if authenticated." on public.page_members for
select
  using (true);

create policy "Can only insert if authenticated." on public.page_members for insert to authenticated
with
  check (true);

create policy "Can only delete if authenticated" on public.page_members for DELETE to authenticated using (true);

create policy "Can only update if authenticated" on public.page_members
for update
  to authenticated using (true);

CREATE
OR REPLACE TRIGGER create_user_page_member_trigger
AFTER INSERT ON public.pages FOR EACH ROW WHEN (
  new.id IS NOT NULL
  and new.owner is not null
)
EXECUTE FUNCTION public.create_first_page_member ();

CREATE POLICY "Can only update if page member." ON public.pages
FOR UPDATE
  USING (
    auth.role () = 'authenticated'
    AND EXISTS (
      SELECT
        1
      FROM
        public.page_members
      WHERE
        page_members.page_id = pages.id
        AND page_members.user_id = auth.uid ()
    )
  );
```

### Chats

```sh
drop table if exists public.chats cascade;

create table
  public.chats (
    id uuid primary key default uuid_generate_v4 () unique,
    created_at timestamp default timezone('UTC', now()),
    updated_at timestamp default timezone('UTC', now()),
    page_id uuid references public.pages (id) on delete cascade,
    user_id uuid references public.profiles (id) on delete cascade,
    message jsonb not null
  );

alter table public.chats enable row level security;

alter publication supabase_realtime
add table public.chats;

create policy "Allow select if authenticated" on public.chats for
select
  to authenticated using (true);

create policy "Can only insert if authenticated." on public.chats for insert to authenticated
with
  check (true);

create policy "Can only update if owner." on public.chats
for update
  using (
    auth.role () = 'authenticated'
    and user_id = auth.uid ()
  );

create policy "Owner can delete chat" on public.chats for delete using (user_id = auth.uid());

create
or replace function handle_updated_at () returns trigger as $$ BEGIN NEW.updated_at = timezone('UTC', now()); RETURN NEW; END; $$ language plpgsql;

create trigger set_updated_at before
update on public.chats for each row
execute function handle_updated_at ();

```

### Storage policies

```sh
insert into
  storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true);

create policy "Allow authenticated access to avatars" on storage.objects for
select
  to authenticated using (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = 'public'
  );

create policy "Allow authenticated to insert avatars" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = 'public'
  );

create policy "Allow authenticated to update avatars" on storage.objects
for update
  to authenticated using (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = 'public'
  );

create policy "Allow authenticated to delete avatars" on storage.objects for delete to authenticated using (
  bucket_id = 'avatars'
  and (storage.foldername (name)) [1] = 'public'
);

create policy "Enable read access for all users" on "storage"."objects" for
select
  using (true);

create policy "Enable insert access to storage bucket for authenticated users" on "storage"."buckets" for insert to authenticated
with
  check (true);

create policy "Enable delete access to storage for authenticated users" on storage.objects for delete to authenticated using (true);

create policy "Enable update access to storage bucket for authenticated users" on storage.objects
for update
  to authenticated using (true);
```

<br>
<br>
<br>

I hope you enjoy this project as much as I enjoyed developing it.

If you have any questions feel free to message me at jaybshinsen@gmail.com