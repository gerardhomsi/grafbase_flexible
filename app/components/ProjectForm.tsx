// "use client";

// import { ProjectInterface, SessionInterface } from "@/common.types";
// import { categoryFilters } from "@/constants";
// import Image from "next/image";
// import CustomMenu from "./CustomMenu";
// import FormField from "./FormField";
// import { useState } from "react";
// import Button from "./Button";
// import { createNewProject, fetchToken, updateProject } from "@/lib/actions";
// import { useRouter } from "next/navigation";

// type Props = {
//   type: string;
//   session: SessionInterface;
//   project?: ProjectInterface;
// };

// const ProjectForm = ({ type, session, project }: Props) => {
//   const router = useRouter();

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setIsSubmitting(true);

//     const { token } = await fetchToken();

//     try {
//       if (type === "create") {
//         await createNewProject(form, session?.user?.id, token);

//         router.push("/");
//       }

//       if (type === "edit") {
//         await updateProject(form, project?.id as string, token);
//         router.push("/");
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     e.preventDefault();

//     const file = e.target.files?.[0];

//     if (!file) return;

//     if (!file.type.includes("image")) {
//       return alert("Please upload an image file");
//     }
//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = () => {
//       const result = reader.result as string;

//       handleStateChange("image", result);
//     };
//   };

//   const handleStateChange = (fieldName: string, value: string) => {
//     setForm((prevState) => ({
//       ...prevState,
//       [fieldName]: value,
//     }));
//   };

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [form, setForm] = useState({
//     title: project?.title || "",
//     description: project?.description || "",
//     image: project?.image || "",
//     liveSiteUrl: project?.liveSiteUrl || "",
//     githubUrl: project?.githubUrl || "",
//     category: project?.category || "",
//   });

//   return (
//     <form onSubmit={handleFormSubmit} className="flexStart form">
//       <div className="flexStart gap-12 form_image-container">
//         <label htmlFor="poster" className="flexStart form_image-label">
//           {form.image && (
//             <Image
//               src={form?.image}
//               className="sm:p-10 object-contain z-20"
//               alt="Project Poster"
//               width={800}
//               height={800}
//             />
//           )}
//         </label>
//         <input
//           id="image"
//           type="file"
//           accept="image/*"
//           required={type === "create"}
//           onChange={handleChangeImage}
//           className="z-30"
//         />
//       </div>
//       <FormField
//         title="Title"
//         state={form.title}
//         placeholder="Flexible"
//         setState={(value) => handleStateChange("title", value)}
//       />
//       <FormField
//         title="Description"
//         state={form.description}
//         placeholder="Showcase and Discover remarkable dev projects..."
//         setState={(value) => handleStateChange("description", value)}
//       />
//       <FormField
//         type="url"
//         title="website URL"
//         state={form.liveSiteUrl}
//         placeholder="https://example.com  "
//         setState={(value) => handleStateChange("liveSiteUrl", value)}
//       />
//       <FormField
//         type="url"
//         title="GitHub URL"
//         state={form.githubUrl}
//         placeholder="https://github.com/yourname"
//         setState={(value) => handleStateChange("githubUrl", value)}
//       />
//       {/* CustomInput Category... */}

//       <CustomMenu
//         title="Category"
//         state={form.category}
//         filters={categoryFilters}
//         setState={(value) => handleStateChange("category", value)}
//       />

//       <div className="flexStart w-full">
//         <Button
//           title={
//             isSubmitting
//               ? `${type === "create" ? "Creating" : "Editing"}`
//               : `${type === "create" ? "Create" : "Edit"}`
//           }
//           type="submit"
//           leftIcon={isSubmitting ? "" : "/plus.svg"}
//           isSubmitting={isSubmitting}
//           rightIcon={""}
//         />
//       </div>
//     </form>
//   );
// };

// export default ProjectForm;

"use client";

import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormField from "./FormField";
import Button from "./Button";
import CustomMenu from "./CustomMenu";
import { categoryFilters } from "@/constants";
import { updateProject, createNewProject, fetchToken } from "@/lib/actions";
import { FormState, ProjectInterface, SessionInterface } from "@/common.types";

type Props = {
  type: string;
  session: SessionInterface;
  project?: ProjectInterface;
};

const ProjectForm = ({ type, session, project }: Props) => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || "",
  });

  const handleStateChange = (fieldName: keyof FormState, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
  };

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.includes("image")) {
      alert("Please upload an image!");

      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      const result = reader.result as string;

      handleStateChange("image", result);
    };
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const { token } = await fetchToken();

    try {
      if (type === "create") {
        await createNewProject(form, session?.user?.id, token);

        router.push("/");
      }

      if (type === "edit") {
        await updateProject(form, project?.id as string, token);

        router.push("/");
      }
    } catch (error) {
      alert(
        `Failed to ${
          type === "create" ? "create" : "edit"
        } a project. Try again!`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flexStart form">
      <div className="flexStart form_image-container ">
        <label htmlFor="poster" className="flexCenter form_image-label">
          {!form.image && "Choose a poster for your project"}
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          required={type === "create" ? true : false}
          className="form_image-input"
          onChange={(e) => handleChangeImage(e)}
        />
        {form.image && (
          <Image
            src={form?.image}
            className="sm:p-10 object-contain z-20"
            alt="image"
            fill
          />
        )}
      </div>

      <FormField
        title="Title"
        state={form.title}
        placeholder="Flexibble"
        setState={(value) => handleStateChange("title", value)}
      />

      <FormField
        title="Description"
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects."
        isTextArea
        setState={(value) => handleStateChange("description", value)}
      />

      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://jsmastery.pro"
        setState={(value) => handleStateChange("liveSiteUrl", value)}
      />

      <FormField
        type="url"
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="https://github.com/adrianhajdin"
        setState={(value) => handleStateChange("githubUrl", value)}
      />

      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange("category", value)}
      />

      <div className="flexStart w-full">
        <Button
          title={
            isSubmitting
              ? `${type === "create" ? "Creating" : "Editing"}`
              : `${type === "create" ? "Create" : "Edit"}`
          }
          type="submit"
          leftIcon={isSubmitting ? "" : "/plus.svg"}
          isSubmitting={isSubmitting}
          rightIcon={""}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
