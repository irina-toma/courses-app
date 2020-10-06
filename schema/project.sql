--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2020-10-06 15:35:20

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 24681)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    street text NOT NULL,
    number text NOT NULL,
    city text NOT NULL,
    postal_code text,
    country text[] NOT NULL
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 24679)
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.addresses_id_seq OWNER TO postgres;

--
-- TOC entry 2895 (class 0 OID 0)
-- Dependencies: 210
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- TOC entry 207 (class 1259 OID 24651)
-- Name: mailing_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mailing_list (
    id integer NOT NULL,
    name text NOT NULL,
    user_ids integer
);


ALTER TABLE public.mailing_list OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 24649)
-- Name: mailing_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mailing_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mailing_list_id_seq OWNER TO postgres;

--
-- TOC entry 2896 (class 0 OID 0)
-- Dependencies: 206
-- Name: mailing_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mailing_list_id_seq OWNED BY public.mailing_list.id;


--
-- TOC entry 204 (class 1259 OID 24609)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    "to" integer,
    "from" integer NOT NULL,
    owner integer NOT NULL,
    body text,
    title text,
    flags text[],
    to_list integer
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 24623)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 2897 (class 0 OID 0)
-- Dependencies: 205
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 213 (class 1259 OID 24692)
-- Name: social; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social (
    id integer NOT NULL,
    facebook text,
    linkedin text,
    twitter text,
    git text
);


ALTER TABLE public.social OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 24690)
-- Name: social_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.social_id_seq OWNER TO postgres;

--
-- TOC entry 2898 (class 0 OID 0)
-- Dependencies: 212
-- Name: social_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_id_seq OWNED BY public.social.id;


--
-- TOC entry 209 (class 1259 OID 24665)
-- Name: user_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_details (
    id integer NOT NULL,
    user_id integer NOT NULL,
    birth_date date,
    gender text,
    address_id integer,
    about_me text,
    social_id integer,
    image_url text
);


ALTER TABLE public.user_details OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 24663)
-- Name: user_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_details_id_seq OWNER TO postgres;

--
-- TOC entry 2899 (class 0 OID 0)
-- Dependencies: 208
-- Name: user_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_details_id_seq OWNED BY public.user_details.id;


--
-- TOC entry 203 (class 1259 OID 24579)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    active boolean NOT NULL,
    activation_token text NOT NULL,
    username text NOT NULL,
    role text NOT NULL,
    details_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 24577)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2900 (class 0 OID 0)
-- Dependencies: 202
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2728 (class 2604 OID 24684)
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- TOC entry 2726 (class 2604 OID 24654)
-- Name: mailing_list id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mailing_list ALTER COLUMN id SET DEFAULT nextval('public.mailing_list_id_seq'::regclass);


--
-- TOC entry 2725 (class 2604 OID 24625)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 2729 (class 2604 OID 24695)
-- Name: social id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social ALTER COLUMN id SET DEFAULT nextval('public.social_id_seq'::regclass);


--
-- TOC entry 2727 (class 2604 OID 24668)
-- Name: user_details id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details ALTER COLUMN id SET DEFAULT nextval('public.user_details_id_seq'::regclass);


--
-- TOC entry 2723 (class 2604 OID 24582)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2887 (class 0 OID 24681)
-- Dependencies: 211
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, street, number, city, postal_code, country) FROM stdin;
\.


--
-- TOC entry 2883 (class 0 OID 24651)
-- Dependencies: 207
-- Data for Name: mailing_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mailing_list (id, name, user_ids) FROM stdin;
\.


--
-- TOC entry 2880 (class 0 OID 24609)
-- Dependencies: 204
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, "to", "from", owner, body, title, flags, to_list) FROM stdin;
\.


--
-- TOC entry 2889 (class 0 OID 24692)
-- Dependencies: 213
-- Data for Name: social; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social (id, facebook, linkedin, twitter, git) FROM stdin;
\.


--
-- TOC entry 2885 (class 0 OID 24665)
-- Dependencies: 209
-- Data for Name: user_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_details (id, user_id, birth_date, gender, address_id, about_me, social_id, image_url) FROM stdin;
\.


--
-- TOC entry 2879 (class 0 OID 24579)
-- Dependencies: 203
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, active, activation_token, username, role, details_id) FROM stdin;
\.


--
-- TOC entry 2901 (class 0 OID 0)
-- Dependencies: 210
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, false);


--
-- TOC entry 2902 (class 0 OID 0)
-- Dependencies: 206
-- Name: mailing_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mailing_list_id_seq', 1, false);


--
-- TOC entry 2903 (class 0 OID 0)
-- Dependencies: 205
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- TOC entry 2904 (class 0 OID 0)
-- Dependencies: 212
-- Name: social_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_id_seq', 1, false);


--
-- TOC entry 2905 (class 0 OID 0)
-- Dependencies: 208
-- Name: user_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_details_id_seq', 1, false);


--
-- TOC entry 2906 (class 0 OID 0)
-- Dependencies: 202
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 37, true);


--
-- TOC entry 2741 (class 2606 OID 24689)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 2731 (class 2606 OID 24589)
-- Name: users email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email UNIQUE (email);


--
-- TOC entry 2737 (class 2606 OID 24633)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 2743 (class 2606 OID 24700)
-- Name: social social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_pkey PRIMARY KEY (id);


--
-- TOC entry 2739 (class 2606 OID 24673)
-- Name: user_details user_details_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT user_details_pkey PRIMARY KEY (id);


--
-- TOC entry 2733 (class 2606 OID 24591)
-- Name: users username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT username UNIQUE (username);


--
-- TOC entry 2735 (class 2606 OID 24587)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2750 (class 2606 OID 24701)
-- Name: user_details fk_address_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES public.addresses(id) NOT VALID;


--
-- TOC entry 2744 (class 2606 OID 24711)
-- Name: users fk_details_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_details_id FOREIGN KEY (details_id) REFERENCES public.user_details(id) NOT VALID;


--
-- TOC entry 2746 (class 2606 OID 24639)
-- Name: messages fk_from; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_from FOREIGN KEY ("to") REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 2747 (class 2606 OID 24644)
-- Name: messages fk_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 2751 (class 2606 OID 24706)
-- Name: user_details fk_social_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT fk_social_id FOREIGN KEY (social_id) REFERENCES public.social(id) NOT VALID;


--
-- TOC entry 2745 (class 2606 OID 24634)
-- Name: messages fk_to; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_to FOREIGN KEY ("to") REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 2749 (class 2606 OID 24674)
-- Name: user_details fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_details
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 2748 (class 2606 OID 24658)
-- Name: mailing_list fk_user_ids; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mailing_list
    ADD CONSTRAINT fk_user_ids FOREIGN KEY (id) REFERENCES public.users(id);


-- Completed on 2020-10-06 15:35:20

--
-- PostgreSQL database dump complete
--

