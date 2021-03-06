CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.task (
    id text NOT NULL,
    user_id text NOT NULL,
    column_id integer NOT NULL,
    title text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    column_rank integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public."user" (
    id text NOT NULL,
    username text NOT NULL,
    avatar text NOT NULL
);
CREATE TABLE public."column" (
    name text NOT NULL,
    id integer NOT NULL
);
CREATE SEQUENCE public.column_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.column_id_seq OWNED BY public."column".id;
ALTER TABLE ONLY public."column" ALTER COLUMN id SET DEFAULT nextval('public.column_id_seq'::regclass);
ALTER TABLE ONLY public."column"
    ADD CONSTRAINT column_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
CREATE TRIGGER set_task_updated_at BEFORE UPDATE ON public.task FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_column_id_fkey FOREIGN KEY (column_id) REFERENCES public."column"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
